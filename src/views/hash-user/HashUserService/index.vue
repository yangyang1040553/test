<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入手机号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户ID" prop="id">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入用户ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="邀请码" prop="invitationCode">
        <el-input
          v-model="queryParams.invitationCode"
          placeholder="请输入用户邀请码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户名" prop="account">
        <el-input
          v-model="queryParams.account"
          placeholder="请输入用户名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickName">
        <el-input
          v-model="queryParams.nickName"
          placeholder="请输入用户昵称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户IP" prop="registerIp">
        <el-input
          v-model="queryParams.registerIp"
          placeholder="请输入用户IP"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择用户状态" clearable>
          <el-option
            v-for="dict in dict.type.user_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="查询下级" prop="fatherInvitationCode">
        <el-input
          v-model="queryParams.fatherInvitationCode"
          placeholder="请输入用户邀请码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="是否在线" prop="online">
        <el-select v-model="queryParams.online" placeholder="请选择是否在线" clearable>
          <el-option
            v-for="dict in dict.type.online"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['hash-user:HashUserService:add']">新增</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['hash-user:HashUserService:edit']"
        >修改</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['hash-user:HashUserService:remove']">删除</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hash-user:HashUserService:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      @sort-change="sortChange"
      :data="HashUserServiceList"
      @selection-change="handleSelectionChange"
      height="600"
    >
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="用户id" align="center" prop="id" /> -->
      <el-table-column label="用户ID" align="center" prop="id" width="160">
        <template slot-scope="scope">
          <div class="global-text-blue" @click="openUserDetail(scope.row.id)">{{scope.row.id}}</div>
        </template>
      </el-table-column>
      <!-- <el-table-column label="用户类型" align="center" prop="userType" /> -->
      <el-table-column label="手机区号" align="center" prop="areaCode" sortable width="100">
        <template slot-scope="scope">
          <div>{{scope.row.areaCode||"-"}}</div>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center" prop="phone" sortable width="120">
        <template slot-scope="scope">
          <div>{{scope.row.phone||"-"}}</div>
        </template>
      </el-table-column>
      <el-table-column label="用户名" align="center" prop="account" width="120" />
      <!-- <el-table-column label="密码" align="center" prop="password" /> -->
      <el-table-column label="设备码" align="center" prop="deviceCode">
        <template slot-scope="scope">
          <div>{{scope.row.deviceCode||"-"}}</div>
        </template>
      </el-table-column>
      <el-table-column label="平台" align="center" prop="platform" width="100" />
      <el-table-column label="用户昵称" align="center" prop="nickName" width="100">
        <!-- <template slot-scope="scope">
          <span
            class="global-text-blue"
            @click="goToUserFeedBack(scope.row)"
          >{{ scope.row.nickName }}</span>
        </template>-->
      </el-table-column>
      <!-- <el-table-column label="头像" align="center" prop="head" width="300" /> -->
      <el-table-column label="用户状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.user_status" :value="scope.row.status" />
        </template>
      </el-table-column>
      <!-- <el-table-column label="是否在线" align="center" prop="online">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.online" :value="scope.row.online" />
        </template>
      </el-table-column>-->
      <el-table-column label="邀请码" align="center" prop="invitationCode">
        <template slot-scope="scope">
          <div>{{scope.row.invitationCode||"-"}}</div>
        </template>
      </el-table-column>
      <el-table-column label="上级邀请码" align="center" prop="fatherInvitationCode" width="100">
        <template slot-scope="scope">
          <div>{{scope.row.fatherInvitationCode||"-"}}</div>
        </template>
      </el-table-column>
      <el-table-column label="注册时间" align="center" prop="registerTime" width="180" sortable></el-table-column>
      <el-table-column label="账户绑定时间" align="center" prop="bindTime" width="180" sortable>
        <template slot-scope="scope">
          <div>{{scope.row.bindTime||"-"}}</div>
        </template>
      </el-table-column>
      <el-table-column label="注册ip" align="center" prop="registerIp" />
      <el-table-column label="登录时间" align="center" prop="loginTime" width="180" sortable></el-table-column>
      <el-table-column label="登录ip" align="center" prop="loginIp" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['hash-user:HashUserService:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-search"
            @click="handleNext(scope.row)"
          >查询下级</el-button>
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

    <el-dialog :title="title" :visible.sync="openDetail" width="600px" append-to-body>
      <el-form ref="form" :model="detailForm" :rules="rules" label-width="100px">
        <el-form-item label="今日投注金额">
          <span class="label">{{ detailForm.betAmount ||0.00}}</span>
        </el-form-item>
        <el-form-item label="今日充值金额">
          <span class="label">{{ detailForm.inAmount ||0.00}}</span>
        </el-form-item>
        <el-form-item label="今日提现金额">
          <span class="label">{{ detailForm.outAmount ||0.00}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openDetail=false">取 消</el-button>
      </div>
    </el-dialog>

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
        </el-form-item>-->
        <!-- <el-form-item label="平台" prop="platform">
          <el-input v-model="form.platform" placeholder="请输入平台-IOS、android" />
        </el-form-item>-->
        <el-form-item label="用户昵称" prop="nickName">
          <el-input v-model="form.nickName" placeholder="请输入用户昵称" />
        </el-form-item>
        <!-- <el-form-item label="邀请码" prop="invitationCode">
          <el-input v-model="form.invitationCode" placeholder="请输入邀请码" />
        </el-form-item>-->
        <el-form-item label="上级邀请码" prop="fatherInvitationCode">
          <el-input v-model="form.fatherInvitationCode" placeholder="请输入上级邀请码(不为空 就建立了绑定关系)" />
        </el-form-item>
        <el-form-item label="用户状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择用户状态">
            <el-option
              v-for="dict in dict.type.user_status"
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

    <UserInfoDialog v-if="openUser" :open="openUser" :id="userId" @close="openUser=false" />
  </div>
</template>

<script>
import { listHashUserService, getHashUserService, delHashUserService, addHashUserService, updateHashUserService, getHashUserServiceDetail } from '@/api/hash-user/HashUserService'
import { mergeOptions } from '../../../utils/dict/DictOptions';
import UserInfoDialog from "../../components/dialog/UserInfoDialog.vue";
import merge from 'webpack-merge'
export default {
  name: 'HashUserService',
  dicts: ['online', 'user_status'],
  components: {
    UserInfoDialog
  },
  data() {
    return {
      openUser: false,
      userId: null,
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
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        id: null,
        pageNum: 1,
        pageSize: 10,
        invitationCode: null,
        phone: null,
        account: null,
        nickName: null,
        status: null,
        online: null,
        orderByColumn: 'registerTime',
        isAsc: 'desc',
        registerIp: null,
        fatherInvitationCode: null
      },
      // 表单参数
      form: {},
      openDetail: false,
      detailForm: {},
      // 表单校验
      rules: {
        // areaCode: [{ required: true, message: '手机区号不能为空', trigger: 'blur' }],
        // phone: [{ required: true, message: '手机号不能为空', trigger: 'blur' }],
        account: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
        nickName: [{ required: true, message: '用户昵称不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '用户状态不能为空', trigger: 'change' }]
      }
    }
  },
  created() {
    console.log(this.$route.query.ip)
    if (this.$route.query.ip) {
      this.queryParams.registerIp = this.$route.query.ip
    }
    this.getList()
  },
  methods: {
    openUserDetail(userId) {
      this.openUser = true;
      this.userId = userId;
    },
    sortChange(val) {
      console.log(val)
      if (val.order && val.order == 'descending') {
        this.queryParams.isAsc = 'desc'
      } else {
        this.queryParams.isAsc = 'asc'
      }
      this.queryParams.orderByColumn = val.prop && val.prop
      console.log(this.queryParams)
      this.getList()
    },
    goToUserFeedBack(row) {
      // this.$router.push({ path: '/user/feedback', query: { userId: row.id } })
      getHashUserServiceDetail(row.id).then(res => {
        this.openDetail = true
        this.detailForm = res.data
      })
    },

    /** 查询用户列表 */
    getList() {
      this.loading = true
      listHashUserService(this.queryParams).then(response => {
        this.HashUserServiceList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      //修改 路由参数
      // this.queryParams.registerIp = null
      // this.queryParams.id = null
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
        loginIp: null,
        orderByColumn: 'registerTime',
        isAsc: 'desc',
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.$router.push({ query: merge({}, {}) })
      this.resetForm('queryForm')
      this.reset()
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加用户'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getHashUserService(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改用户'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateHashUserService(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addHashUserService(this.form).then(response => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    handleNext(row) {
      this.queryParams.fatherInvitationCode = row.invitationCode
      this.getList()
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids
      this.$modal
        .confirm('是否确认删除用户编号为"' + ids + '"的数据项？')
        .then(function () {
          return delHashUserService(ids)
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess('删除成功')
        })
        .catch(() => { })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        'hash-user/HashUserService/export',
        {
          ...this.queryParams
        },
        `HashUserService_${new Date().getTime()}.xlsx`
      )
    }
  }
}
</script>
<style>
.label {
  color: #99a9bf;
  font-weight: bold;
}
</style>