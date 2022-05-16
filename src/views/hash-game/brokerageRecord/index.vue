<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="88px">
      <el-form-item label="玩家id" prop="userId">
        <el-input v-model="queryParams.userId" placeholder="请输入玩家id" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="佣金等级" prop="level">
        <el-input v-model="queryParams.level" placeholder="请输入第几级的佣金" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="钱包类型" prop="walletType">
        <el-select v-model="queryParams.walletType" placeholder="请选择钱包类型" clearable>
          <el-option v-for="dict in dict.type.wallet_type" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="反佣类型" prop="brokerageType">
        <el-select v-model="queryParams.brokerageType" placeholder="请选择反佣类型" clearable>
          <el-option v-for="dict in dict.type.brokerage_type" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="下级玩家id" prop="childUserId">
        <el-input v-model="queryParams.childUserId" placeholder="请输入下级玩家id" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="查询状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择" clearable>
          <el-option v-for="dict in dict.type.record_status" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker clearable v-model="queryParams.createTime" type="date" value-format="yyyy-MM-dd"
          placeholder="请选择创建时间"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['hash-game:brokerageRecord:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['hash-game:brokerageRecord:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['hash-game:brokerageRecord:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['hash-game:brokerageRecord:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="brokerageRecordList" @selection-change="handleSelectionChange"
      @sort-change="sortChange" :default-sort="{ prop: 'create_time', order: 'descending' }">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="唯一id" align="center" prop="id" />
      <el-table-column label="玩家id" align="center" prop="userId" />
      <el-table-column label="佣金等级" align="center" prop="level" width="75" />
      <el-table-column label="钱包类型" align="center" prop="walletType" width="85">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.wallet_type" :value="scope.row.walletType" />
        </template>
      </el-table-column>
      <el-table-column label="下注金额" align="center" prop="betAmount" />
      <el-table-column label="反佣类型" align="center" prop="brokerageType" width="85">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.brokerage_type" :value="scope.row.brokerageType" />
        </template>
      </el-table-column>
      <el-table-column label="反佣金额" align="center" prop="brokerageAmount" />
      <el-table-column label="下级玩家id" align="center" prop="childUserId">
        <template slot-scope="scope">
          <div class="blue-text" @click="handleUserInfo(scope.row)">{{ scope.row.childUserId }}</div>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" width="75">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.record_status" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180" sortable></el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['hash-game:brokerageRecord:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['hash-game:brokerageRecord:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改玩家返佣记录对话框 -->
    <!-- <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="玩家id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入玩家id" />
        </el-form-item>
        <el-form-item label="佣金等级" prop="level">
          <el-input v-model="form.level" placeholder="请输入第几级的佣金" />
        </el-form-item>
        <el-form-item label="钱包类型" prop="walletType">
          <el-select v-model="form.walletType" placeholder="请选择钱包类型">
            <el-option v-for="dict in dict.type.wallet_type" :key="dict.value" :label="dict.label" :value="dict.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="下注金额" prop="betAmount">
          <el-input v-model="form.betAmount" placeholder="请输入下注金额" />
        </el-form-item>
        <el-form-item label="反佣类型" prop="brokerageType">
          <el-select v-model="form.brokerageType" placeholder="请选择反佣类型">
            <el-option v-for="dict in dict.type.brokerage_type" :key="dict.value" :label="dict.label"
              :value="parseInt(dict.value)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="反佣金额" prop="brokerageAmount">
          <el-input v-model="form.brokerageAmount" placeholder="请输入反佣金额" />
        </el-form-item>
        <el-form-item label="下级玩家id" prop="childUserId">
          <el-input v-model="form.childUserId" placeholder="请输入下级玩家id" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择">
            <el-option v-for="dict in dict.type.record_status" :key="dict.value" :label="dict.label"
              :value="parseInt(dict.value)"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>-->

    <!-- 添加或修改用户对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <div class="parent">
        <el-form ref="form" class="form" :model="form" :rules="rules" label-width="100px" disabled>

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
            <!-- <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" placeholder="请输入密码" />
        </el-form-item>-->
            <el-form-item label="设备码" prop="deviceCode">
              <el-input v-model="form.deviceCode" placeholder="请输入设备码" />
            </el-form-item>
            <el-form-item label="平台" prop="platform">
              <el-input v-model="form.platform" placeholder="请输入平台-IOS、android" />
            </el-form-item>
            <el-form-item label="用户昵称" prop="nickName">
              <el-input v-model="form.nickName" placeholder="请输入用户昵称" />
            </el-form-item>
            <el-form-item label="邀请码" prop="invitationCode">
              <el-input v-model="form.invitationCode" placeholder="请输入邀请码" />
            </el-form-item>
            <el-form-item label="上级邀请码" prop="fatherInvitationCode">
              <el-input v-model="form.fatherInvitationCode" />
            </el-form-item>
          </div>
          <div class="line"></div>
          <div class="right">
            <el-form-item label="注册IP" prop="registerIp">
              <el-input v-model="form.registerIp" />
            </el-form-item>
            <el-form-item label="登录IP" prop="loginIp">
              <el-input v-model="form.loginIp" />
            </el-form-item>
            <el-form-item label="注册时间" prop="registerTime">
              <el-input v-model="form.registerTime" />
            </el-form-item>
            <el-form-item label="用户状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择用户状态">
                <el-option v-for="dict in dict.type.user_status" :key="dict.value" :label="dict.label"
                  :value="parseInt(dict.value)"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button type="primary" @click="submitForm">确 定</el-button> -->
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listBrokerageRecord, getBrokerageRecord, delBrokerageRecord, addBrokerageRecord, updateBrokerageRecord } from "@/api/hash-game/brokerageRecord";
import { getHashUserService } from "@/api/hash-user/HashUserService";

export default {
  name: "BrokerageRecord",
  dicts: ['wallet_type', 'brokerage_type', 'record_status', 'user_status'],
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
      // 玩家返佣记录表格数据
      brokerageRecordList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        level: null,
        walletType: null,
        brokerageType: null,
        childUserId: null,
        status: null,
        createTime: null,
        sort: 'desc'
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
    sortChange(val) {
      console.log(val)
      if (val.order && val.order == 'descending') {
        this.queryParams.sort = 'desc'
      } else {
        this.queryParams.sort = 'asc'
      }
      this.getList()
    },
    /** 查询玩家返佣记录列表 */
    getList() {
      this.loading = true;
      listBrokerageRecord(this.queryParams).then(response => {
        this.brokerageRecordList = response.rows;
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
        userId: null,
        level: null,
        walletType: null,
        betAmount: null,
        brokerageType: null,
        brokerageAmount: null,
        childUserId: null,
        status: null,
        createTime: null
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
      this.title = "添加玩家返佣记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getBrokerageRecord(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改玩家返佣记录";
      });
    },
    handleUserInfo(row) {
      const id = row.childUserId
      getHashUserService(id).then(response => {
        console.log(response)
        if (response.data) {
          this.form = response.data;
          this.open = true;
          this.title = "用户详情";
        }
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateBrokerageRecord(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addBrokerageRecord(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除玩家返佣记录编号为"' + ids + '"的数据项？').then(function () {
        return delBrokerageRecord(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('hash-game/brokerageRecord/export', {
        ...this.queryParams
      }, `brokerageRecord_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
<style lang="scss" scoped>
.blue-text {
  color: #1890ff;
}

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

.dialog-footer {
  border-top: 1px solid gainsboro;
  width: 100%;
  padding-top: 10px;
}

  ::v-deep .el-dialog__body {
  padding: 30px 20px 0px 20px  !important;

}

</style>