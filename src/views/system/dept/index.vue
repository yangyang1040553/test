<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item :label="$t('department')" prop="deptName">
        <el-input
          v-model="queryParams.deptName"
          :placeholder="$t('type_department_name')"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item :label="$t('status')" prop="status">
        <el-select v-model="queryParams.status" :placeholder="$t('department_status')" clearable>
          <el-option
            v-for="dict in dict.type.sys_normal_disable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">{{$t('search')}}</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">{{$t('reset')}}</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:dept:add']"
        >{{$t('new')}}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-sort"
          size="mini"
          @click="toggleExpandAll"
        >{{$t('expand_collapse')}}</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="deptList"
      row-key="deptId"
      :default-expand-all="isExpandAll"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="deptName" :label="$t('department')" width="260"></el-table-column>
      <el-table-column prop="orderNum" :label="$t('sort')" width="200"></el-table-column>
      <el-table-column prop="status" :label="$t('status')" width="100">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column :label="$t('create_time')" align="center" prop="createTime" width="200">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('operation')" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:dept:edit']"
          >{{$t('edit')}}</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['system:dept:add']"
          >{{$t('new')}}</el-button>
          <el-button
            v-if="scope.row.parentId != 0"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:dept:remove']"
          >{{$t('delete')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- ?????????????????????????????? -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-row>
          <el-col :span="24" v-if="form.parentId !== 0">
            <el-form-item :label="$t('parent_department')" prop="parentId">
              <treeselect v-model="form.parentId" :options="deptOptions" :normalizer="normalizer" :placeholder="$t('select_parent_department')" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('department')" prop="deptName">
              <el-input v-model="form.deptName" :placeholder="$t('type_department_name')" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('display_sort')" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('principal')" prop="leader">
              <el-input v-model="form.leader" :placeholder="$t('enter_principal')" maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('phone')" prop="phone">
              <el-input v-model="form.phone" :placeholder="$t('type_phone')" maxlength="11" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('email')" prop="email">
              <el-input v-model="form.email" :placeholder="$t('type_email')" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('department_status')">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in dict.type.sys_normal_disable"
                  :key="dict.value"
                  :label="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">{{$t('sure')}}</el-button>
        <el-button @click="cancel">{{$t('cancel')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listDept, getDept, delDept, addDept, updateDept, listDeptExcludeChild } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {getKey} from '@/lang'

export default {
  name: "Dept",
  dicts: ['sys_normal_disable'],
  components: { Treeselect },
  data() {
    return {
      // ?????????
      loading: true,
      // ??????????????????
      showSearch: true,
      // ???????????????
      deptList: [],
      // ???????????????
      deptOptions: [],
      // ???????????????
      title: "",
      // ?????????????????????
      open: false,
      // ?????????????????????????????????
      isExpandAll: true,
      // ????????????????????????
      refreshTable: true,
      // ????????????
      queryParams: {
        deptName: undefined,
        status: undefined
      },
      // ????????????
      form: {},
      // ????????????
      rules: {
        parentId: [
          { required: true, message: "????????????????????????", trigger: "blur" }
        ],
        deptName: [
          { required: true, message: "????????????????????????", trigger: "blur" }
        ],
        orderNum: [
          { required: true, message: "????????????????????????", trigger: "blur" }
        ],
        email: [
          {
            type: "email",
            message: "??????????????????????????????",
            trigger: ["blur", "change"]
          }
        ],
        phone: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "??????????????????????????????",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** ?????????????????? */
    getList() {
      this.loading = true;
      listDept(this.queryParams).then(response => {
        this.deptList = this.handleTree(response.data, "deptId");
        this.loading = false;
      });
    },
    /** ???????????????????????? */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.deptId,
        label: node.deptName,
        children: node.children
      };
    },
    // ????????????
    cancel() {
      this.open = false;
      this.reset();
    },
    // ????????????
    reset() {
      this.form = {
        deptId: undefined,
        parentId: undefined,
        deptName: undefined,
        orderNum: undefined,
        leader: undefined,
        phone: undefined,
        email: undefined,
        status: "0"
      };
      this.resetForm("form");
    },
    /** ?????????????????? */
    handleQuery() {
      this.getList();
    },
    /** ?????????????????? */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** ?????????????????? */
    handleAdd(row) {
      this.reset();
      if (row != undefined) {
        this.form.parentId = row.deptId;
      }
      this.open = true;
      this.title = getKey('add_deptment');
      listDept().then(response => {
        this.deptOptions = this.handleTree(response.data, "deptId");
      });
    },
    /** ??????/???????????? */
    toggleExpandAll() {
      this.refreshTable = false;
      this.isExpandAll = !this.isExpandAll;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },
    /** ?????????????????? */
    handleUpdate(row) {
      this.reset();
      getDept(row.deptId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "????????????";
      });
      listDeptExcludeChild(row.deptId).then(response => {
        this.deptOptions = this.handleTree(response.data, "deptId");
      });
    },
    /** ???????????? */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.deptId != undefined) {
            updateDept(this.form).then(response => {
              this.$modal.msgSuccess("????????????");
              this.open = false;
              this.getList();
            });
          } else {
            addDept(this.form).then(response => {
              this.$modal.msgSuccess("????????????");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** ?????????????????? */
    handleDelete(row) {
      this.$modal.confirm('???????????????????????????"' + row.deptName + '"???????????????').then(function() {
        return delDept(row.deptId);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("????????????");
      }).catch(() => {});
    }
  }
};
</script>
