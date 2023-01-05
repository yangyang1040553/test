<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="108px"
    >
      <el-form-item label="账号" prop="username">
        <el-input
          v-model="queryParams.username"
          placeholder="请输入账号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="电话号码" prop="phoneNumber">
        <el-input
          v-model="queryParams.phoneNumber"
          placeholder="请输入电话号码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input
          v-model="queryParams.email"
          placeholder="请输入邮箱"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设备码" prop="deviceId">
        <el-input
          v-model="queryParams.deviceId"
          placeholder="请输入设备码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="昵称" prop="nickName">
        <el-input
          v-model="queryParams.nickName"
          placeholder="请输入昵称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="账号绑定时间" prop="bindTime">
        <el-date-picker
          clearable
          v-model="queryParams.bindTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择账号绑定时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="状态" prop="userStatus">
        <el-select
          v-model="queryParams.userStatus"
          placeholder="请选择状态"
          clearable
        >
          <el-option
            v-for="dict in dict.type.user_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="最后登录时间" prop="lastLoginTime">
        <el-date-picker
          clearable
          v-model="queryParams.lastLoginTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择最后登录时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="vip过期时间" prop="vipExpireTime">
        <el-date-picker
          clearable
          v-model="queryParams.vipExpireTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择vip过期时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="是否是会员" prop="isVip">
        <el-select
          v-model="queryParams.isVip"
          placeholder="请选择是否是会员"
          clearable
        >
          <el-option
            v-for="dict in dict.type.is_vip"
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
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['hashUser:user:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['hashUser:user:edit']"
        >修改</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['hashUser:user:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hashUser:user:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="userList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="账号" align="center" prop="username" />
      <el-table-column label="密码" align="center" prop="password" />
      <el-table-column label="电话号码" align="center" prop="phoneNumber" />
      <el-table-column label="邮箱" align="center" prop="email" />
      <el-table-column label="设备码" align="center" prop="deviceId" />
      <el-table-column label="昵称" align="center" prop="nickName" />
      <el-table-column label="来源类型" align="center" prop="originType" />
      <el-table-column label="来源id" align="center" prop="originId" />
      <el-table-column
        label="账号绑定时间"
        align="center"
        prop="bindTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.bindTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="登录ip" align="center" prop="loginIp" />
      <el-table-column label="注册ip" align="center" prop="regIp" />
      <el-table-column label="用户类型" align="center" prop="userType" />
      <el-table-column
        label="状态"
        align="center"
        prop="userStatus"
      >
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.user_status"
            :value="scope.row.userStatus"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="最后登录时间"
        align="center"
        prop="lastLoginTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.lastLoginTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="vip过期时间"
        align="center"
        prop="vipExpireTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.vipExpireTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否是会员" align="center" prop="isVip">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.is_vip" :value="scope.row.isVip" />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['hashUser:user:edit']"
            >修改</el-button
          >
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['hashUser:user:remove']"
            >删除</el-button
          > -->
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

    <!-- 添加或修改用户管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="账号" prop="username">
          <el-input v-model="form.username" placeholder="请输入账号" />
        </el-form-item>
        <!-- <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" placeholder="请输入密码" />
        </el-form-item> -->
        <el-form-item label="电话号码" prop="phoneNumber">
          <el-input v-model="form.phoneNumber" placeholder="请输入电话号码" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <!-- <el-form-item label="设备码" prop="deviceId">
          <el-input v-model="form.deviceId" placeholder="请输入设备码" />
        </el-form-item> -->
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="form.nickName" placeholder="请输入昵称" />
        </el-form-item>
        <!-- <el-form-item label="来源id" prop="originId">
          <el-input v-model="form.originId" placeholder="请输入来源id" />
        </el-form-item> -->
        <!-- <el-form-item label="账号绑定时间" prop="bindTime">
          <el-date-picker
            clearable
            v-model="form.bindTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择账号绑定时间"
          >
          </el-date-picker>
        </el-form-item> -->
        <!-- <el-form-item label="登录ip" prop="loginIp">
          <el-input v-model="form.loginIp" placeholder="请输入登录ip" />
        </el-form-item>
        <el-form-item label="注册ip" prop="regIp">
          <el-input v-model="form.regIp" placeholder="请输入注册ip" />
        </el-form-item> -->
        <el-form-item label="状态" prop="userStatus">
          <el-select v-model="form.userStatus" placeholder="请选择状态">
            <el-option
              v-for="dict in dict.type.user_status"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="最后登录时间" prop="lastLoginTime">
          <el-date-picker
            clearable
            v-model="form.lastLoginTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择最后登录时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="vip过期时间" prop="vipExpireTime">
          <el-date-picker
            clearable
            v-model="form.vipExpireTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择vip过期时间"
          >
          </el-date-picker>
        </el-form-item> -->
        <el-form-item label="是否是会员" prop="isVip">
          <el-select v-model="form.isVip" placeholder="请选择是否是会员">
            <el-option
              v-for="dict in dict.type.is_vip"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
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
import {
  listUser,
  getUser,
  delUser,
  addUser,
  updateUser,
} from "@/api/hashUser/user";

export default {
  name: "User",
  dicts: ["is_vip", "user_status"],
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
      // 用户管理表格数据
      userList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        username: null,
        phoneNumber: null,
        email: null,
        deviceId: null,
        nickName: null,
        bindTime: null,
        userType: null,
        userStatus: null,
        lastLoginTime: null,
        vipExpireTime: null,
        isVip: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询用户管理列表 */
    getList() {
      this.loading = true;
      listUser(this.queryParams).then((response) => {
        this.userList = response.rows;
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
        username: null,
        password: null,
        phoneNumber: null,
        email: null,
        deviceId: null,
        nickName: null,
        originType: null,
        originId: null,
        bindTime: null,
        loginIp: null,
        regIp: null,
        userType: null,
        userStatus: null,
        lastLoginTime: null,
        createTime: null,
        vipExpireTime: null,
        isVip: null,
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
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加用户管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getUser(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改用户管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateUser(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addUser(this.form).then((response) => {
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
      this.$modal
        .confirm('是否确认删除用户管理编号为"' + ids + '"的数据项？')
        .then(function () {
          return delUser(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "hashUser/user/export",
        {
          ...this.queryParams,
        },
        `user_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
