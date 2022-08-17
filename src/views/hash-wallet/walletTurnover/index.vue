<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="账单ID" prop="id">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入账单ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户ID" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入用户ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户邀请码" prop="invitationCode">
        <el-input
          v-model="queryParams.invitationCode"
          placeholder="请输入用户邀请码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="流水类型" prop="code">
        <el-select v-model="queryParams.code" placeholder="请选择流水类型" clearable>
          <el-option
            v-for="dict in dict.type.money_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="钱包类型" prop="walletType">
        <el-select v-model="queryParams.walletType" placeholder="请选择钱包类型" clearable>
          <el-option
            v-for="dict in dict.type.wallet_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          clearable
          v-model="queryParams.createTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择创建时间"
        ></el-date-picker>
      </el-form-item>
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
          v-hasPermi="['hash-wallet:walletTurnover:add']"
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
          v-hasPermi="['hash-wallet:walletTurnover:edit']"
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
          v-hasPermi="['hash-wallet:walletTurnover:remove']"
        >删除</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hash-wallet:walletTurnover:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="walletTurnoverList"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
      height="580"
      border
    >
      <el-table-column label="账单ID" align="center" prop="id" width="200" />
      <el-table-column label="玩家ID" align="center" prop="userId" width="180">
        <template slot-scope="scope">
          <div
            class="global-text-blue"
            @click="openUserDetail(scope.row.userId)"
          >{{scope.row.userId}}</div>
        </template>
      </el-table-column>
      <el-table-column label="昵称" align="center" prop="nickName">
        <template slot-scope="scope">
          <div>{{ scope.row.note_name? scope.row.note_name: scope.row.nickName}}</div>
        </template>
      </el-table-column>
      <el-table-column label="用户邀请码" align="center" prop="invitationCode" />
      <el-table-column label="流水类型" align="center" prop="code">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.money_type" :value="scope.row.code" />
        </template>
      </el-table-column>
      <el-table-column label="钱包类型" align="center" prop="walletType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.wallet_type" :value="scope.row.walletType" />
        </template>
      </el-table-column>
      <el-table-column label="流水金额" align="center" prop="amount" sortable />
      <el-table-column label="当前金额" align="center" prop="currentAmount" sortable />
      <el-table-column label="之后金额" align="center" prop="afterAmount" sortable />
      <el-table-column label="关联订单" align="center" prop="linkedOrder" width="200">
        <template slot-scope="scope">
          <div class="global-text-blue" @click="toOrderList(scope.row)">{{scope.row.linkedOrder}}</div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['hash-wallet:walletTurnover:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['hash-wallet:walletTurnover:remove']"
          >删除</el-button>
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

    <!-- 添加或修改钱包流水记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="流水类型" prop="code">
          <el-select v-model="form.code" placeholder="请选择流水类型">
            <el-option
              v-for="dict in dict.type.money_type"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="钱包类型" prop="walletType">
          <el-select v-model="form.walletType" placeholder="请选择钱包类型">
            <el-option
              v-for="dict in dict.type.wallet_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="流水金额" prop="amount">
          <el-input v-model="form.amount" placeholder="请输入流水金额" />
        </el-form-item>
        <el-form-item label="当前金额" prop="currentAmount">
          <el-input v-model="form.currentAmount" placeholder="请输入当前金额" />
        </el-form-item>
        <el-form-item label="之后金额" prop="afterAmount">
          <el-input v-model="form.afterAmount" placeholder="请输入之后金额" />
        </el-form-item>
        <el-form-item label="关联订单" prop="linkedOrder">
          <el-input v-model="form.linkedOrder" placeholder="请输入关联订单" />
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
import merge from 'webpack-merge'
import { listWalletTurnover, getWalletTurnover, delWalletTurnover, addWalletTurnover, updateWalletTurnover } from "@/api/hash-wallet/walletTurnover";
import UserInfoDialog from "../../components/dialog/UserInfoDialog.vue";
export default {
  name: "WalletTurnover",
  dicts: ['wallet_type', 'money_type'],
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
      // 钱包流水记录表格数据
      walletTurnoverList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        code: null,
        walletType: null,
        createTime: null,
        orderByColumn: 'createTime',
        isAsc: 'desc'
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    if (this.$route.query.userId) {
      this.queryParams.userId = this.$route.query.userId
    }
    // if (this.$route.query.createTime) {
    //   this.queryParams.createTime = this.$route.query.createTime
    // }
    // if (this.$route.query.orderId) {
    //   this.queryParams.id = this.$route.query.orderId
    // }
    this.getList();
  },
  methods: {
    toOrderList(row) {
      //console.log(row)
      var path = {}
      var query = { orderId: row.linkedOrder }
      //流水类型 1:下注 2:中奖 3:退回 4:佣金提现 5:充值 6:提现 7:转换 8:后台入款 9:后台扣款
      if (row.code == 1 || row.code == 2 || row.code == 3 || row.code == 13) {
        path = "/hash-game/record"
      }
      else if (row.code == 4) {
        path = "/hash-game/widthdrawRecord"
      }
      else if (row.code == 5 || row.code == 14) {
        path = "/wallet/rechargeOrder"
      }
      else if (row.code == 6) {
        path = "/audit/withDrawList"
      }
      else if (row.code == 7) {
        path = "/wallet/walletOrder"
      }
      else if (row.code == 8 || row.code == 9) {
        path = "/wallet/walletoOpt"
      }
      else if (row.code == 11) {
        path = "/audit/withDrawList"
      }
      else if (row.code == 12) {
        path = "/hash-operation/operationRecord"
      }

      // else if (row.code == 8) { }
      // else if (row.code == 9) { }
      //console.log(path)
      if (path) {
        this.$router.push({ path: path, query })
      }
    },
    openUserDetail(userId) {
      this.openUser = true;
      this.userId = userId;
    },
    sortChange(val) {
      if (val.order && val.order == 'descending') {
        this.queryParams.isAsc = 'desc'
      } else {
        this.queryParams.isAsc = 'asc'
      }
      this.queryParams.orderByColumn = val.prop && val.prop
      this.getList()
    },
    /** 查询钱包流水记录列表 */
    getList() {
      this.loading = true;
      listWalletTurnover(this.queryParams).then(response => {
        this.walletTurnoverList = response.rows;
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
        code: null,
        walletType: null,
        amount: null,
        currentAmount: null,
        afterAmount: null,
        linkedOrder: null,
        createTime: null,
        orderByColumn: 'createTime',
        isAsc: 'desc'
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
      this.$router.push({ query: merge({}, {}) })
      this.resetForm('queryForm')
      // this.queryParams.id = null
      this.queryParams.userId = null
      this.queryParams.createTime = null
      this.queryParams.id = null
      // //console.log(this.queryParams)
      this.handleQuery(this.queryParams)
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
      this.title = "添加钱包流水记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getWalletTurnover(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改钱包流水记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateWalletTurnover(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addWalletTurnover(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除钱包流水记录编号为"' + ids + '"的数据项？').then(function () {
        return delWalletTurnover(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      let obj = { ...this.queryParams }
      obj.pageSize = 5000
      this.download('hash-wallet/walletTurnover/export', {
        ...obj
      }, `walletTurnover_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
