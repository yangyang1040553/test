<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item :label="$t('menu_name')" prop="menuName">
        <el-input v-model="queryParams.menuName" :placeholder="$t('tyepe_menu_name')" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item :label="$t('status')" prop="status">
        <el-select v-model="queryParams.status" :placeholder="$t('menu_status')" clearable>
          <el-option v-for="dict in dict.type.sys_normal_disable" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">{{ $t('search') }}</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">{{ $t('reset') }}</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['system:menu:add']">{{ $t('new') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" plain icon="el-icon-sort" size="mini" @click="toggleExpandAll">{{ $t('expand_collapse')
        }}
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-if="refreshTable" v-loading="loading" :data="menuList" row-key="menuId"
      :default-expand-all="isExpandAll" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
      <el-table-column prop="menuName" :label="$t('menu_name')" :show-overflow-tooltip="true" width="260">
        <template slot-scope="scope">
          <span>{{ $t(scope.row.menuName.toString()) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="icon" :label="$t('icon')" align="center" width="100">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column prop="orderNum" :label="$t('sort')" width="60"></el-table-column>
      <el-table-column prop="perms" :label="$t('authority_id')" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="component" :label="$t('component_path')" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="status" :label="$t('status')" width="80">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column :label="$t('create_time')" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('operate')" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:menu:edit']">{{ $t('edit') }}</el-button>
          <el-button size="mini" type="text" icon="el-icon-plus" @click="handleAdd(scope.row)"
            v-hasPermi="['system:menu:add']">{{ $t('new') }}</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:menu:remove']">{{ $t('delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- ?????????????????????????????? -->
    <el-dialog :title="title" :visible.sync="open" width="680px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('parent_menu')">
              <treeselect v-model="form.parentId" :options="menuOptions" :normalizer="normalizer" :show-count="true"
                :placeholder="$t('select_parent_menu')">
                <label slot="option-label" slot-scope="{ node, shouldShowCount, count, labelClassName, countClassName }"
                  :class="labelClassName">
                  {{ $t(node.label.toString()) }}
                </label>
              </treeselect>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('menu_type')" prop="menuType">
              <el-radio-group v-model="form.menuType">
                <el-radio label="M">{{ $t('directory') }}</el-radio>
                <el-radio label="C">{{ $t('menu') }}</el-radio>
                <el-radio label="F">{{ $t('button') }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="form.menuType != 'F'">
            <el-form-item :label="$t('menu_icon')" prop="icon">
              <el-popover placement="bottom-start" width="460" trigger="click" @show="$refs['iconSelect'].reset()">
                <IconSelect ref="iconSelect" @selected="selected" />
                <el-input slot="reference" v-model="form.icon" :placeholder="$t('click_the_select_icon')" readonly>
                  <svg-icon v-if="form.icon" slot="prefix" :icon-class="form.icon" class="el-input__icon"
                    style="height: 32px;width: 16px;" />
                  <i v-else slot="prefix" class="el-icon-search el-input__icon" />
                </el-input>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('menu_name')" prop="menuName">
              <el-input v-model="form.menuName" :placeholder="$t('tyepe_menu_name')" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('display_sort')" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'F'">
            <el-form-item>
              <span slot="label">
                <el-tooltip :content="$t('the_routing_address_needs_to_start_with_http_s')" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                {{ $t('whether_external_chain') }}
              </span>
              <el-radio-group v-model="form.isFrame">
                <el-radio label="0">{{ $t('yes') }}</el-radio>
                <el-radio label="1">{{ $t('no') }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'F'">
            <el-form-item prop="path">
              <span slot="label">
                <el-tooltip :content="$t('The_routing_address_of_the_access')" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                {{ $t('routing_address') }}
              </span>
              <el-input v-model="form.path" :placeholder="$t('type_routing_address')" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType == 'C'">
            <el-form-item prop="component">
              <span slot="label">
                <el-tooltip :content="$t('view_text')" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                {{ $t('component_path') }}
              </span>
              <el-input v-model="form.component" :placeholder="$t('type_compment_address')" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'M'">
            <el-form-item>
              <el-input v-model="form.perms" :placeholder="$t('Please_enter_a_permission_ID')" maxlength="100" />
              <span slot="label">
                <el-tooltip :content="$t('control_text')" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                {{ $t('permission_character') }}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType == 'C'">
            <el-form-item>
              <el-input v-model="form.query" :placeholder="$t('Please_enter_routing_parameters')" maxlength="255" />
              <span slot="label">
                <el-tooltip :content="$t('route_paramater_text')" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                {{ $t('routing_parameters') }}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType == 'C'">
            <el-form-item>
              <span slot="label">
                <el-tooltip :content="$t('keep_route_text')" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                {{ $t('whether_to_cache') }}
              </span>
              <el-radio-group v-model="form.isCache">
                <el-radio label="0">{{ $t('cache') }}</el-radio>
                <el-radio label="1">{{ $t('no_cache') }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'F'">
            <el-form-item>
              <span slot="label">
                <el-tooltip :content="$t('hide_route_text')" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                {{ $t('display_status') }}
              </span>
              <el-radio-group v-model="form.visible">
                <el-radio v-for="dict in dict.type.sys_show_hide" :key="dict.value" :label="dict.value">{{ dict.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'F'">
            <el-form-item>
              <span slot="label">
                <el-tooltip :content="$t('stop_route_text')" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                {{ $t('menu_status') }}
              </span>
              <el-radio-group v-model="form.status">
                <el-radio v-for="dict in dict.type.sys_normal_disable" :key="dict.value" :label="dict.value">
                  {{ dict.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">{{ $t('sure') }}</el-button>
        <el-button @click="cancel">{{ $t('cancel') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listMenu, getMenu, delMenu, addMenu, updateMenu } from "@/api/system/menu";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import IconSelect from "@/components/IconSelect";
import { getKey } from '@/lang'
import store from "@/store";

export default {
  name: "Menu",
  dicts: ['sys_show_hide', 'sys_normal_disable'],
  components: { Treeselect, IconSelect },
  data() {
    return {
      // ?????????
      loading: true,
      // ??????????????????
      showSearch: true,
      // ?????????????????????
      menuList: [],
      // ???????????????
      menuOptions: [],
      // ???????????????
      title: "",
      // ?????????????????????
      open: false,
      // ?????????????????????????????????
      isExpandAll: false,
      // ????????????????????????
      refreshTable: true,
      // ????????????
      queryParams: {
        menuName: undefined,
        visible: undefined
      },
      // ????????????
      form: {},
      // ????????????
      rules: {
        menuName: [
          { required: true, message: "????????????????????????", trigger: "blur" }
        ],
        orderNum: [
          { required: true, message: "????????????????????????", trigger: "blur" }
        ],
        path: [
          { required: true, message: "????????????????????????", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // ????????????
    selected(name) {
      this.form.icon = name;
    },
    /** ?????????????????? */
    getList() {
      this.loading = true;
      listMenu(this.queryParams).then(response => {
        this.menuList = this.handleTree(response.data, "menuId");
        this.loading = false;
      });
    },
    /** ???????????????????????? */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.menuId,
        label: node.menuName,
        children: node.children
      };
    },
    /** ??????????????????????????? */
    getTreeselect() {
      listMenu().then(response => {
        this.menuOptions = [];
        const menu = { menuId: 0, menuName: getKey('main_category'), children: [] };
        menu.children = this.handleTree(response.data, "menuId");
        this.menuOptions.push(menu);
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
        menuId: undefined,
        parentId: 0,
        menuName: undefined,
        icon: undefined,
        menuType: "M",
        orderNum: undefined,
        isFrame: "1",
        isCache: "0",
        visible: "0",
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
      this.getTreeselect();
      if (row != null && row.menuId) {
        this.form.parentId = row.menuId;
      } else {
        this.form.parentId = 0;
      }
      this.open = true;
      this.title = "????????????";
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
      this.getTreeselect();
      getMenu(row.menuId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "????????????";
      });
    },
    /** ???????????? */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.menuId != undefined) {
            updateMenu(this.form).then(response => {
              this.$modal.msgSuccess("????????????");
              this.open = false;
              this.getList();
              store.dispatch('GenerateRoutes')
            });
          } else {
            addMenu(this.form).then(response => {
              this.$modal.msgSuccess("????????????");
              this.open = false;
              this.getList();
              store.dispatch('GenerateRoutes')
            });
          }
        }
      });
    },
    /** ?????????????????? */
    handleDelete(row) {
      this.$modal.confirm('???????????????????????????"' + row.menuName + '"???????????????').then(function () {
        return delMenu(row.menuId);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("????????????");
        store.dispatch('GenerateRoutes')
      }).catch(() => { });
    }
  }
};
</script>
