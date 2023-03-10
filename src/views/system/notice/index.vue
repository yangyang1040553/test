<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item :label="$t('announcement_title')" prop="noticeTitle">
        <el-input
          v-model="queryParams.noticeTitle"
          :placeholder="$t('enter_announcement_title')"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item :label="$t('operation_user')" prop="createBy">
        <el-input
          v-model="queryParams.createBy"
          :placeholder="$t('enter_operation_user')"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item :label="$t('status')" prop="noticeType">
        <el-select
          v-model="queryParams.noticeType"
          :placeholder="$t('announcement_type')"
          clearable
        >
          <el-option
            v-for="dict in dict.type.sys_notice_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >{{$t('search')}}</el-button>
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
          v-hasPermi="['system:notice:add']"
        >{{$t('new')}}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:notice:edit']"
        >{{$t('edit')}}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:notice:remove']"
        >{{$t('delete')}}</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="noticeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column :label="$t('serial_number')" align="center" prop="noticeId" />
      <el-table-column
        :label="$t('announcement_title')"
        align="center"
        prop="noticeTitle"
        :show-overflow-tooltip="true"
      />
      <el-table-column :label="$t('announcement_type')" align="center" prop="noticeType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_notice_type" :value="scope.row.noticeType" />
        </template>
      </el-table-column>
      <el-table-column :label="$t('status')" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_notice_status" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column :label="$t('creator')" align="center" prop="createBy" />
      <el-table-column :label="$t('create_time')" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('operation')"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:notice:edit']"
          >{{$t('edit')}}</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:notice:remove']"
          >{{$t('delete')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- ?????????????????????????????? -->
    <el-dialog :title="title" :visible.sync="open" class="dialog" width="900px" append-to-body>
      <el-form ref="form" class="form" :model="form" :rules="rules" label-width="160px">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('announcement_title')" prop="noticeTitle">
              <el-input v-model="form.noticeTitle" :placeholder="$t('enter_announcement_title')" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('announcement_type')" prop="noticeType">
              <el-select v-model="form.noticeType" :placeholder="$t('select_announcement_type')">
                <el-option
                  v-for="dict in dict.type.sys_notice_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('status')">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in dict.type.sys_notice_status"
                  :key="dict.value"
                  :label="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('content')">
              <editor v-model="form.noticeContent" :min-height="192" />
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
import { listNotice, getNotice, delNotice, addNotice, updateNotice } from "@/api/system/notice";
import { getKey } from "@/lang";

export default {
  name: "Notice",
  dicts: ['sys_notice_status', 'sys_notice_type'],
  data() {
    return {
      // ?????????
      loading: true,
      // ????????????
      ids: [],
      // ???????????????
      single: true,
      // ???????????????
      multiple: true,
      // ??????????????????
      showSearch: true,
      // ?????????
      total: 0,
      // ??????????????????
      noticeList: [],
      // ???????????????
      title: "",
      // ?????????????????????
      open: false,
      // ????????????
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        noticeTitle: undefined,
        createBy: undefined,
        status: undefined
      },
      // ????????????
      form: {},
      // ????????????
      rules: {
        noticeTitle: [
          { required: true, message: "????????????????????????", trigger: "blur" }
        ],
        noticeType: [
          { required: true, message: "????????????????????????", trigger: "change" }
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
      listNotice(this.queryParams).then(response => {
        this.noticeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // ????????????
    cancel() {
      this.open = false;
      this.reset();
    },
    // ????????????
    reset() {
      this.form = {
        noticeId: undefined,
        noticeTitle: undefined,
        noticeType: undefined,
        noticeContent: undefined,
        status: "0"
      };
      this.resetForm("form");
    },
    /** ?????????????????? */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** ?????????????????? */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // ?????????????????????
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.noticeId)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** ?????????????????? */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = getKey('add_announcement')
    },
    /** ?????????????????? */
    handleUpdate(row) {
      this.reset();
      const noticeId = row.noticeId || this.ids
      getNotice(noticeId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "????????????";
      });
    },
    /** ???????????? */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.noticeId != undefined) {
            updateNotice(this.form).then(response => {
              this.$modal.msgSuccess("????????????");
              this.open = false;
              this.getList();
            });
          } else {
            addNotice(this.form).then(response => {
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
      const noticeIds = row.noticeId || this.ids
      this.$modal.confirm('?????????????????????????????????"' + noticeIds + '"???????????????').then(function () {
        return delNotice(noticeIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("????????????");
      }).catch(() => { });
    }
  }
};
</script>
<style   lang="scss" scoped>
.form {
  height: 50vh;
}
</style>