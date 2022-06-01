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
      <el-form-item label="用户名" prop="account">
        <el-input
          v-model="queryParams.account"
          placeholder="请输入用户名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="注册时间" prop="registerTime">
        <el-date-picker
          clearable
          v-model="queryParams.registerTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择注册时间"
        ></el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="代理返佣赔率" prop="promoteOdds">
        <el-input
          v-model="queryParams.promoteOdds"
          placeholder="请输入代理返佣赔率"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分享返佣赔率" prop="sharePromoteOdds">
        <el-input
          v-model="queryParams.sharePromoteOdds"
          placeholder="请输入分享出去的返佣赔率"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
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
          v-hasPermi="['hash-statistical:promoteLeaderboard:add']"
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
          v-hasPermi="['hash-statistical:promoteLeaderboard:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['hash-statistical:promoteLeaderboard:remove']"
        >删除</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hash-statistical:promoteLeaderboard:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="promoteLeaderboardList"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
      height="600"
    >
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <!-- <el-table-column label="用户ID" align="center" prop="id" width="160" /> -->
      <el-table-column label="用户ID" align="center" prop="id" width="160">
        <template slot-scope="scope">
          <div class="global-text-blue" @click="openUserDetail(scope.row.id)">{{scope.row.id}}</div>
        </template>
      </el-table-column>
      <el-table-column label="手机区号" align="center" prop="areaCode" />
      <el-table-column label="手机号" align="center" prop="phone" />
      <el-table-column label="用户昵称" align="center" prop="nickName" />
      <el-table-column label="用户名" align="center" prop="account" />
      <el-table-column label="代理返佣赔率" align="center" prop="promoteOdds" />
      <el-table-column label="分享返佣赔率" align="center" prop="sharePromoteOdds" />
      <el-table-column label="一级代理人数" align="center" prop="level1Person" />
      <el-table-column label="二级代理人数" align="center" prop="level2Person" />
      <el-table-column label="三级代理人数" align="center" prop="level3Person" />
      <el-table-column label="推广总计" align="center" prop="sumnumber"  sortable/>
      <el-table-column label="注册时间" align="center" prop="registerTime" width="180" sortable>
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.registerTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-zoom-in"
            @click="handleUpdate(scope.row)"
          >详情</el-button>
        </template>
      </el-table-column>-->
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改VIEW对话框 -->
    <UserInfoDialog v-if="openUser" :open="openUser" :id="userId" @close="openUser=false" />
    <!-- <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" class="form" :model="form" label-width="120px" disabled>
        <div class="left">
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
          <el-form-item label="设备码" prop="deviceCode">
            <el-input v-model="form.deviceCode" placeholder="请输入设备码" />
          </el-form-item>
          <el-form-item label="平台" prop="platform">
            <el-input v-model="form.platform" placeholder="请输入平台-IOS、android" />
          </el-form-item>
          <el-form-item label="用户昵称" prop="nickName">
            <el-input v-model="form.nickName" placeholder="请输入用户昵称" />
          </el-form-item>
          <el-form-item label="一级代理人数" prop="level1Person">
            <el-input v-model="form.level1Person" placeholder="请输入用户昵称" />
          </el-form-item>
          <el-form-item label="二级代理人数" prop="level2Person">
            <el-input v-model="form.level2Person" placeholder="请输入用户昵称" />
          </el-form-item>
          <el-form-item label="三级代理人数" prop="level3Person">
            <el-input v-model="form.level3Person" placeholder="请输入用户昵称" />
          </el-form-item>
          <el-form-item label="总代理人数" prop="sumnumber">
            <el-input v-model="form.sumnumber" placeholder="请输入用户昵称" />
          </el-form-item>
        </div>
        <div class="line"></div>
        <div class="right">
          <el-form-item label="头像" prop="head">
            <el-input v-model="form.head" placeholder="请输入头像" />
          </el-form-item>
          <el-form-item label="用户状态" prop="status">
            <el-select v-model="form.status" placeholder="请选择用户状态 0正常 1冻结 ">
              <el-option
                v-for="dict in dict.type.user_status"
                :key="dict.value"
                :label="dict.label"
                :value="parseInt(dict.value)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否在线" prop="online">
            <el-select v-model="form.online" placeholder="请选择是否在线 0离线 1在线">
              <el-option
                v-for="dict in dict.type.online"
                :key="dict.value"
                :label="dict.label"
                :value="parseInt(dict.value)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="邀请码" prop="invitationCode">
            <el-input v-model="form.invitationCode" placeholder="请输入邀请码" />
          </el-form-item>
          <el-form-item label="上级邀请码" prop="fatherInvitationCode">
            <el-input v-model="form.fatherInvitationCode" placeholder="请输入上级邀请码(不为空 就建立了绑定关系)" />
          </el-form-item>
          <el-form-item label="注册时间" prop="registerTime">
            <el-date-picker
              clearable
              v-model="form.registerTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择注册时间"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="账户绑定时间" prop="bindTime">
            <el-date-picker
              clearable
              v-model="form.bindTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择账户绑定时间"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="注册ip" prop="registerIp">
            <el-input v-model="form.registerIp" placeholder="请输入注册ip" />
          </el-form-item>
          <el-form-item label="登录时间" prop="loginTime">
            <el-date-picker
              clearable
              v-model="form.loginTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择登录时间"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="登录ip" prop="loginIp">
            <el-input v-model="form.loginIp" placeholder="请输入登录ip" />
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>-->
  </div>
</template>

<script>
import { listPromoteLeaderboard, getPromoteLeaderboard, delPromoteLeaderboard, addPromoteLeaderboard, updatePromoteLeaderboard } from "@/api/hash-statistical/promoteLeaderboard";
import { getHashUserService } from '@/api/hash-user/HashUserService'
import UserInfoDialog from "../../components/dialog/UserInfoDialog.vue";

export default {
  name: "PromoteLeaderboard",
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
      //用户ID
      userId: null,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // VIEW表格数据
      promoteLeaderboardList: [],
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
        registerTime: null,
        promoteOdds: null,
        sharePromoteOdds: null,
        orderByColumn: 'sumnumber',
        isAsc: 'desc',
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [
          { required: true, message: "玩家id不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
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
    openUserDetail(userId) {
      this.openUser = true;
      this.userId = userId;
    },
    /** 查询VIEW列表 */
    getList() {
      this.loading = true;
      listPromoteLeaderboard(this.queryParams).then(response => {
        this.promoteLeaderboardList = response.rows;
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
        level1Person: null,
        level2Person: null,
        level3Person: null,
        areaCode: null,
        phone: null,
        nickName: null,
        account: null,
        registerTime: null,
        promoteOdds: null,
        sharePromoteOdds: null,
        sumnumber: null,
        orderByColumn: 'sumnumber',
        isAsc: 'desc',
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
      this.title = "添加VIEW";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      this.userId = id
      this.open = true
      // getHashUserService(id).then(response => {
      //   this.form = response.data
      //   this.form.level1Person = row.level1Person
      //   this.form.level2Person = row.level2Person
      //   this.form.level3Person = row.level3Person
      //   this.form.sumnumber = row.sumnumber
      //   this.open = true
      //   this.title = '修改用户'
      // })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updatePromoteLeaderboard(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPromoteLeaderboard(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除VIEW编号为"' + ids + '"的数据项？').then(function () {
        return delPromoteLeaderboard(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('hash-statistical/promoteLeaderboard/export', {
        ...this.queryParams
      }, `promoteLeaderboard_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
<style  lang="scss" scoped>
.form {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: row;

  .left,
  .right {
    width: 49%;
    height: 100%;
  }

  .line {
    width: 1px;
    margin-left: 10px;
    height: 70vh;
    background: gainsboro;
  }
}
</style>