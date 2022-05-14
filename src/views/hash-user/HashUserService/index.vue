<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="queryParams.phone" placeholder="请输入手机号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="用户名" prop="account">
        <el-input v-model="queryParams.account" placeholder="请输入用户名" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickName">
        <el-input v-model="queryParams.nickName" placeholder="请输入用户昵称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="用户状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择用户状态" clearable>
          <el-option v-for="dict in dict.type.user_status" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否在线" prop="online">
        <el-select v-model="queryParams.online" placeholder="请选择是否在线" clearable>
          <el-option v-for="dict in dict.type.online" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['hash-user:HashUserService:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['hash-user:HashUserService:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['hash-user:HashUserService:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['hash-user:HashUserService:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="HashUserServiceList" @selection-change="handleSelectionChange" height="600">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="用户id" align="center" prop="id" /> -->
      <!-- <el-table-column label="用户类型" align="center" prop="userType" /> -->
      <el-table-column label="手机区号" align="center" prop="areaCode" />
      <el-table-column label="手机号" align="center" prop="phone" />
      <el-table-column label="用户名" align="center" prop="account" />
      <!-- <el-table-column label="密码" align="center" prop="password" /> -->
      <el-table-column label="设备码" align="center" prop="deviceCode" />
      <el-table-column label="平台" align="center" prop="platform" />
      <el-table-column label="用户昵称" align="center" prop="nickName" />
      <!-- <el-table-column label="头像" align="center" prop="head" width="300" /> -->
      <el-table-column label="用户状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.user_status" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="是否在线" align="center" prop="online">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.online" :value="scope.row.online" />
        </template>
      </el-table-column>
      <el-table-column label="邀请码" align="center" prop="invitationCode" />
      <el-table-column label="上级邀请码" align="center" prop="fatherInvitationCode" />
      <el-table-column label="注册时间" align="center" prop="registerTime" width="180">
      </el-table-column>
      <el-table-column label="账户绑定时间" align="center" prop="bindTime" width="180">
      </el-table-column>
      <el-table-column label="注册ip" align="center" prop="registerIp" />
      <el-table-column label="登录时间" align="center" prop="loginTime" width="180">
      </el-table-column>
      <el-table-column label="登录ip" align="center" prop="loginIp" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['hash-user:HashUserService:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['hash-user:HashUserService:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改用户对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="手机区号" prop="areaCode">
          <el-input v-model="form.areaCode" placeholder="请输入手机区号" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="用户名" prop="account">
          <el-input v-model="form.account" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" placeholder="请输入密码" />
        </el-form-item>
        <!-- <el-form-item label="设备码" prop="deviceCode">
          <el-input v-model="form.deviceCode" placeholder="请输入设备码" />
        </el-form-item> -->
        <!-- <el-form-item label="平台" prop="platform">
          <el-input v-model="form.platform" placeholder="请输入平台-IOS、android" />
        </el-form-item> -->
        <el-form-item label="用户昵称" prop="nickName">
          <el-input v-model="form.nickName" placeholder="请输入用户昵称" />
        </el-form-item>
        <!-- <el-form-item label="邀请码" prop="invitationCode">
          <el-input v-model="form.invitationCode" placeholder="请输入邀请码" />
        </el-form-item> -->
        <el-form-item label="上级邀请码" prop="fatherInvitationCode">
          <el-input v-model="form.fatherInvitationCode" placeholder="请输入上级邀请码(不为空 就建立了绑定关系)" />
        </el-form-item>
        <el-form-item label="用户状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择用户状态">
            <el-option v-for="dict in dict.type.user_status" :key="dict.value" :label="dict.label"
              :value="parseInt(dict.value)"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listHashUserService, getHashUserService, delHashUserService, addHashUserService, updateHashUserService } from "@/api/hash-user/HashUserService";

export default {
  name: "HashUserService",
  dicts: ['online', 'user_status'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户表格数据
      HashUserServiceList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        phone: null,
        account: null,
        nickName: null,
        status: null,
        online: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      listHashUserService(this.queryParams).then(response => {
        this.HashUserServiceList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        userType: null,
        areaCode: null,
        phone: null,
        account: null,
        password: null,
        deviceCode: null,
        platform: null,
        nickName: null,
        head: null,
        status: null,
        online: null,
        invitationCode: null,
        fatherInvitationCode: null,
        registerTime: null,
        bindTime: null,
        registerIp: null,
        loginTime: null,
        loginIp: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加用户";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getHashUserService(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改用户";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateHashUserService(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addHashUserService(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除用户编号为"' + ids + '"的数据项？').then(function () {
        return delHashUserService(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('hash-user/HashUserService/export', {
        ...this.queryParams
      }, `HashUserService_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
