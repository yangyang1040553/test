<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item :label="$t('role_name')" prop="roleName">
        <el-input
          v-model="queryParams.roleName"
          :placeholder="$t('type_role_name')"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item :label="$t('permission_character')" prop="roleKey">
        <el-input
          v-model="queryParams.roleKey"
          :placeholder="$t('type_permission_character')"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item :label="$t('status')" prop="status">
        <el-select
          v-model="queryParams.status"
          :placeholder="$t('role_status')"
          clearable
          style="width: 240px"
        >
          <el-option
            v-for="dict in dict.type.sys_normal_disable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('create_time')">
        <el-date-picker
          v-model="dateRange"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          :start-placeholder="$t('start_date')"
          :end-placeholder="$t('end_date')"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >{{ $t('search') }}</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">{{ $t('reset') }}</el-button>
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
          v-hasPermi="['system:role:add']"
        >{{ $t('new') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:role:edit']"
        >{{ $t('edit') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:role:remove']"
        >{{ $t('delete') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:role:export']"
        >{{ $t('export') }}</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="roleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column :label="$t('ID')" prop="roleId" width="120" />
      <el-table-column :label="$t('role_name')" prop="roleName" :show-overflow-tooltip="true" />
      <el-table-column
        :label="$t('permission_character')"
        prop="roleKey"
        :show-overflow-tooltip="true"
      />
      <el-table-column :label="$t('display_order')" prop="roleSort" />
      <el-table-column :label="$t('status')" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column :label="$t('create_time')" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('operate')" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.roleId !== 1">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:role:edit']"
          >{{ $t('edit') }}</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:role:remove']"
          >{{ $t('delete') }}</el-button>
          <el-dropdown
            size="mini"
            @command="(command) => handleCommand(command, scope.row)"
            v-hasPermi="['system:role:edit']"
          >
            <span class="el-dropdown-link">
              <i class="el-icon-d-arrow-right el-icon--right"></i>
              {{ $t('more') }}
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                command="handleDataScope"
                icon="el-icon-circle-check"
                v-hasPermi="['system:role:edit']"
              >{{ $t('edit') }}</el-dropdown-item>
              <el-dropdown-item
                command="handleAuthUser"
                icon="el-icon-user"
                v-hasPermi="['system:role:edit']"
              >{{ $t('assign_users') }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- ???????????????????????????????????? -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="200px" class="dialog">
        <el-form-item :label="$t('role_name')" prop="roleName">
          <el-input v-model="form.roleName" :placeholder="$t('type_role_name')" />
        </el-form-item>
        <el-form-item prop="roleKey">
          <span slot="label">
            <el-tooltip
              content="??????????????????????????????????????????@PreAuthorize(`@ss.hasRole('admin')`)"
              placement="top"
            >
              <i class="el-icon-question"></i>
            </el-tooltip>
            {{ $t('permission_character') }}
          </span>
          <el-input v-model="form.roleKey" :placeholder="$t('type_permission_character')" />
        </el-form-item>
        <el-form-item :label="$t('role_order')" prop="roleSort">
          <el-input-number v-model="form.roleSort" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item :label="$t('status')">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in dict.type.sys_normal_disable"
              :key="dict.value"
              :label="dict.value"
            >
              {{ dict.label
              }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('menu_permission')">
          <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event, 'menu')">
            {{ $t('expand_collapse')
            }}
          </el-checkbox>
          <el-checkbox
            v-model="menuNodeAll"
            @change="handleCheckedTreeNodeAll($event, 'menu')"
          >{{ $t('all_none') }}</el-checkbox>
          <el-checkbox
            v-model="form.menuCheckStrictly"
            @change="handleCheckedTreeConnect($event, 'menu')"
          >{{ $t('father_son_linkage') }}</el-checkbox>
          <el-tree
            class="tree-border"
            :data="menuOptions"
            show-checkbox
            ref="menu"
            node-key="id"
            :check-strictly="!form.menuCheckStrictly"
            empty-text="?????????????????????"
            :props="defaultProps"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ $t(node.label.toString()) }}</span>
            </span>
          </el-tree>
        </el-form-item>
        <el-form-item :label="$t('remark')">
          <el-input v-model="form.remark" type="textarea" :placeholder="$t('type_content')"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">{{ $t('sure') }}</el-button>
        <el-button @click="cancel">{{ $t('cancel') }}</el-button>
      </div>
    </el-dialog>

    <!-- ????????????????????????????????? -->
    <el-dialog :title="title" :visible.sync="openDataScope" width="500px" append-to-body>
      <el-form :model="form" label-width="80px">
        <el-form-item :label="$t('role_name')">
          <el-input v-model="form.roleName" :disabled="true" />
        </el-form-item>
        <el-form-item :label="$t('permission_character')">
          <el-input v-model="form.roleKey" :disabled="true" />
        </el-form-item>
        <el-form-item :label="$t('scope_of_authority')">
          <el-select v-model="form.dataScope" @change="dataScopeSelectChange">
            <el-option
              v-for="item in dataScopeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('data_permission')" v-show="form.dataScope == 2">
          <el-checkbox v-model="deptExpand" @change="handleCheckedTreeExpand($event, 'dept')">
            {{ $t('expand_collapse')
            }}
          </el-checkbox>
          <el-checkbox
            v-model="deptNodeAll"
            @change="handleCheckedTreeNodeAll($event, 'dept')"
          >{{ $t('all_none') }}</el-checkbox>
          <el-checkbox
            v-model="form.deptCheckStrictly"
            @change="handleCheckedTreeConnect($event, 'dept')"
          >
            {{
            $t('father_son_linkage')
            }}
          </el-checkbox>
          <el-tree
            class="tree-border"
            :data="deptOptions"
            show-checkbox
            default-expand-all
            ref="dept"
            node-key="id"
            :check-strictly="!form.deptCheckStrictly"
            empty-text="?????????????????????"
            :props="defaultProps"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ $t(node.label.toString()) }}</span>
            </span>
          </el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitDataScope">{{ $t('sure') }}</el-button>
        <el-button @click="cancelDataScope">{{ $t('cancel') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listRole, getRole, delRole, addRole, updateRole, dataScope, changeRoleStatus } from "@/api/system/role";
import { treeselect as menuTreeselect, roleMenuTreeselect } from "@/api/system/menu";
import { treeselect as deptTreeselect, roleDeptTreeselect } from "@/api/system/dept";

export default {
  name: "Role",
  dicts: ['sys_normal_disable'],
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
      roleList: [],
      // ???????????????
      title: "",
      // ?????????????????????
      open: false,
      // ???????????????????????????????????????
      openDataScope: false,
      menuExpand: false,
      menuNodeAll: false,
      deptExpand: true,
      deptNodeAll: false,
      // ????????????
      dateRange: [],
      // ??????????????????
      dataScopeOptions: [
        {
          value: "1",
          label: "??????????????????"
        },
        {
          value: "2",
          label: "??????????????????"
        },
        {
          value: "3",
          label: "?????????????????????"
        },
        {
          value: "4",
          label: "??????????????????????????????"
        },
        {
          value: "5",
          label: "?????????????????????"
        }
      ],
      // ????????????
      menuOptions: [],
      // ????????????
      deptOptions: [],
      // ????????????
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        roleName: undefined,
        roleKey: undefined,
        status: undefined
      },
      // ????????????
      form: {},
      defaultProps: {
        children: "children",
        label: "label"
      },
      // ????????????
      rules: {
        roleName: [
          { required: true, message: "????????????????????????", trigger: "blur" }
        ],
        roleKey: [
          { required: true, message: "????????????????????????", trigger: "blur" }
        ],
        roleSort: [
          { required: true, message: "????????????????????????", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return "??????";
    },
    /** ?????????????????? */
    getList() {
      this.loading = true;
      listRole(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.roleList = response.rows;
        this.total = response.total;
        this.loading = false;
      }
      );
    },
    /** ????????????????????? */
    getMenuTreeselect() {
      menuTreeselect().then(response => {
        this.menuOptions = response.data;
      });
    },
    /** ????????????????????? */
    getDeptTreeselect() {
      deptTreeselect().then(response => {
        this.deptOptions = response.data;
      });
    },
    // ????????????????????????
    getMenuAllCheckedKeys() {
      // ??????????????????????????????
      let checkedKeys = this.$refs.menu.getCheckedKeys();
      // ????????????????????????
      let halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
    },
    // ????????????????????????
    getDeptAllCheckedKeys() {
      // ??????????????????????????????
      let checkedKeys = this.$refs.dept.getCheckedKeys();
      // ????????????????????????
      let halfCheckedKeys = this.$refs.dept.getHalfCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
    },
    /** ????????????ID????????????????????? */
    getRoleMenuTreeselect(roleId) {
      return roleMenuTreeselect(roleId).then(response => {
        this.menuOptions = response.menus;
        return response;
      });
    },
    /** ????????????ID????????????????????? */
    getRoleDeptTreeselect(roleId) {
      return roleDeptTreeselect(roleId).then(response => {
        this.deptOptions = response.depts;
        return response;
      });
    },
    // ??????????????????
    handleStatusChange(row) {
      let text = row.status === "0" ? "??????" : "??????";
      this.$modal.confirm('?????????"' + text + '""' + row.roleName + '"????????????').then(function () {
        return changeRoleStatus(row.roleId, row.status);
      }).then(() => {
        this.$modal.msgSuccess(text + "??????");
      }).catch(function () {
        row.status = row.status === "0" ? "1" : "0";
      });
    },
    // ????????????
    cancel() {
      this.open = false;
      this.reset();
    },
    // ??????????????????????????????
    cancelDataScope() {
      this.openDataScope = false;
      this.reset();
    },
    // ????????????
    reset() {
      if (this.$refs.menu != undefined) {
        this.$refs.menu.setCheckedKeys([]);
      }
      this.menuExpand = false,
        this.menuNodeAll = false,
        this.deptExpand = true,
        this.deptNodeAll = false,
        this.form = {
          roleId: undefined,
          roleName: undefined,
          roleKey: undefined,
          roleSort: 0,
          status: "0",
          menuIds: [],
          deptIds: [],
          menuCheckStrictly: true,
          deptCheckStrictly: true,
          remark: undefined
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
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // ?????????????????????
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.roleId)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    // ??????????????????
    handleCommand(command, row) {
      switch (command) {
        case "handleDataScope":
          this.handleDataScope(row);
          break;
        case "handleAuthUser":
          this.handleAuthUser(row);
          break;
        default:
          break;
      }
    },
    // ??????????????????/?????????
    handleCheckedTreeExpand(value, type) {
      if (type == 'menu') {
        let treeList = this.menuOptions;
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value;
        }
      } else if (type == 'dept') {
        let treeList = this.deptOptions;
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.dept.store.nodesMap[treeList[i].id].expanded = value;
        }
      }
    },
    // ??????????????????/????????????
    handleCheckedTreeNodeAll(value, type) {
      if (type == 'menu') {
        this.$refs.menu.setCheckedNodes(value ? this.menuOptions : []);
      } else if (type == 'dept') {
        this.$refs.dept.setCheckedNodes(value ? this.deptOptions : []);
      }
    },
    // ???????????????????????????
    handleCheckedTreeConnect(value, type) {
      if (type == 'menu') {
        this.form.menuCheckStrictly = value ? true : false;
      } else if (type == 'dept') {
        this.form.deptCheckStrictly = value ? true : false;
      }
    },
    /** ?????????????????? */
    handleAdd() {
      this.reset();
      this.getMenuTreeselect();
      this.open = true;
      this.title = "????????????";
    },
    /** ?????????????????? */
    handleUpdate(row) {
      this.reset();
      const roleId = row.roleId || this.ids
      const roleMenu = this.getRoleMenuTreeselect(roleId);
      getRole(roleId).then(response => {
        this.form = response.data;
        this.open = true;
        this.$nextTick(() => {
          roleMenu.then(res => {
            let checkedKeys = res.checkedKeys
            checkedKeys.forEach((v) => {
              this.$nextTick(() => {
                this.$refs.menu.setChecked(v, true, false);
              })
            })
          });
        });
        this.title = "????????????";
      });
    },
    /** ?????????????????????????????? */
    dataScopeSelectChange(value) {
      if (value !== '2') {
        this.$refs.dept.setCheckedKeys([]);
      }
    },
    /** ???????????????????????? */
    handleDataScope(row) {
      this.reset();
      const roleDeptTreeselect = this.getRoleDeptTreeselect(row.roleId);
      getRole(row.roleId).then(response => {
        this.form = response.data;
        this.openDataScope = true;
        this.$nextTick(() => {
          roleDeptTreeselect.then(res => {
            this.$refs.dept.setCheckedKeys(res.checkedKeys);
          });
        });
        this.title = "??????????????????";
      });
    },
    /** ?????????????????? */
    handleAuthUser: function (row) {
      const roleId = row.roleId;
      this.$router.push("/system/role-auth/user/" + roleId);
    },
    /** ???????????? */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.roleId != undefined) {
            this.form.menuIds = this.getMenuAllCheckedKeys();
            updateRole(this.form).then(response => {
              this.$modal.msgSuccess("????????????");
              this.open = false;
              this.getList();
            });
          } else {
            this.form.menuIds = this.getMenuAllCheckedKeys();
            addRole(this.form).then(response => {
              this.$modal.msgSuccess("????????????");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** ?????????????????????????????? */
    submitDataScope: function () {
      if (this.form.roleId != undefined) {
        this.form.deptIds = this.getDeptAllCheckedKeys();
        dataScope(this.form).then(response => {
          this.$modal.msgSuccess("????????????");
          this.openDataScope = false;
          this.getList();
        });
      }
    },
    /** ?????????????????? */
    handleDelete(row) {
      const roleIds = row.roleId || this.ids;
      this.$modal.confirm('?????????????????????????????????"' + roleIds + '"???????????????').then(function () {
        return delRole(roleIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("????????????");
      }).catch(() => { });
    },
    /** ?????????????????? */
    handleExport() {
      this.download('system/role/export', {
        ...this.queryParams
      }, `role_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
<style lang="scss" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.dialog {
  height: 70vh;
}
</style>
