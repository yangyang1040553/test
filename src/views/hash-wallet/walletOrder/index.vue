<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="交易号" prop="transactionNo">
        <el-input
          v-model="queryParams.transactionNo"
          placeholder="请输入交易号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="玩家ID" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入玩家ID"
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
      <el-form-item label="源钱包类型" prop="sourceWalletType">
        <el-select v-model="queryParams.sourceWalletType" placeholder="请选择源钱包类型" clearable>
          <el-option
            v-for="dict in dict.type.wallet_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="转入钱包类型" prop="toWalletType">
        <el-select v-model="queryParams.toWalletType" placeholder="请选择转入钱包类型" clearable>
          <el-option
            v-for="dict in dict.type.wallet_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="付款地址" prop="paymentAddress">
        <el-input
          v-model="queryParams.paymentAddress"
          placeholder="请输入付款地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="收款地址" prop="collectionAddress">
        <el-input
          v-model="queryParams.collectionAddress"
          placeholder="请输入收款地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="转入状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择转入状态" clearable>
          <el-option
            v-for="dict in dict.type.in_status"
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
          v-hasPermi="['hash-wallet:walletOrder:add']"
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
          v-hasPermi="['hash-wallet:walletOrder:edit']"
        >修改</el-button>
      </el-col>-->
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['hash-wallet:walletOrder:remove']"
        >删除</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hash-wallet:walletOrder:export']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <div class="curr-money">
          <!-- <div class="money-text">今日转换 TRX: {{(currTrx/10000).toFixed(2)}}</div>
          <div class="money-text">今日转换 USDT: {{(currUsdt/10000).toFixed(2)}}</div>-->

          <div class="money-text">今日转换 TRX: {{currTrx}}</div>
          <div class="money-text">今日转换 USDT: {{currUsdt}}</div>
        </div>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      @sort-change="sortChange"
      :data="walletOrderList"
      :row-class-name="tableRowClassName"
      @selection-change="handleSelectionChange"
      border
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="订单ID" align="center" prop="id" />
      <el-table-column label="交易号" align="center" prop="transactionNo" width="180" />
      <!-- <el-table-column label="玩家ID" align="center" prop="userId" /> -->
      <el-table-column label="玩家ID" align="center" prop="userId">
        <template slot-scope="scope">
          <div
            class="global-text-blue"
            @click="openUserDetail(scope.row.userId)"
          >{{scope.row.userId}}</div>
        </template>
      </el-table-column>
      <el-table-column label="玩家昵称" align="center" prop="nickName">
        <template slot-scope="scope">
          <div>{{scope.row.nickName}}</div>
        </template>
      </el-table-column>
      <el-table-column label="邀请码" align="center" prop="fatherInvitationCode" width="100">
        <template slot-scope="scope">
          <div
            v-if="queryParams.invitationCode==scope.row.invitationCode"
            class="global-text-green"
          >{{scope.row.invitationCode||"-"}}</div>
          <div v-else>{{scope.row.invitationCode||"-"}}</div>
        </template>
      </el-table-column>
      <el-table-column label="源钱包类型" align="center" prop="sourceWalletType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.wallet_type" :value="scope.row.sourceWalletType" />
        </template>
      </el-table-column>
      <el-table-column label="转入钱包类型" align="center" prop="toWalletType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.wallet_type" :value="scope.row.toWalletType" />
        </template>
      </el-table-column>
      <el-table-column label="付款地址" align="center" prop="paymentAddress" width="180" />
      <el-table-column label="收款地址" align="center" prop="collectionAddress" width="180" />
      <el-table-column label="源金额" align="center" prop="sourceAmount" width="120" sortable />
      <el-table-column label="转入金额" align="center" prop="toAmount" width="120" sortable />
      <el-table-column label="矿工费" align="center" prop="minerAmount" />
      <el-table-column label="转换比例" align="center" prop="scala" />
      <el-table-column label="转入状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag
            v-if="scope.row.status==1"
            :options="dict.type.in_status"
            :value="scope.row.status"
          />
          <div v-else>{{"失败"}}</div>
        </template>
      </el-table-column>
      <el-table-column label="说明" align="center" prop="note" />
      <el-table-column label="时间" align="center" prop="createTime" width="180" sortable />
      <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['hash-wallet:walletOrder:remove']"
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

    <!-- 添加或修改转换订单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="交易号" prop="transactionNo">
          <el-input v-model="form.transactionNo" placeholder="请输入交易号" />
        </el-form-item>
        <el-form-item label="玩家ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入玩家ID" />
        </el-form-item>
        <el-form-item label="源钱包类型USDT TRX" prop="sourceWalletType">
          <el-select v-model="form.sourceWalletType" placeholder="请选择源钱包类型USDT TRX">
            <el-option
              v-for="dict in dict.type.wallet_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="转入钱包类型USDT TRX" prop="toWalletType">
          <el-select v-model="form.toWalletType" placeholder="请选择转入钱包类型USDT TRX">
            <el-option
              v-for="dict in dict.type.wallet_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="付款地址" prop="paymentAddress">
          <el-input v-model="form.paymentAddress" placeholder="请输入付款地址" />
        </el-form-item>
        <el-form-item label="收款地址" prop="collectionAddress">
          <el-input v-model="form.collectionAddress" placeholder="请输入收款地址" />
        </el-form-item>
        <el-form-item label="源金额" prop="sourceAmount">
          <el-input v-model="form.sourceAmount" placeholder="请输入源金额" />
        </el-form-item>
        <el-form-item label="转入金额" prop="toAmount">
          <el-input v-model="form.toAmount" placeholder="请输入转入金额" />
        </el-form-item>
        <el-form-item label="矿工费" prop="minerAmount">
          <el-input v-model="form.minerAmount" placeholder="请输入矿工费" />
        </el-form-item>
        <el-form-item label="转入状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择转入状态">
            <el-option
              v-for="dict in dict.type.in_status"
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
import merge from 'webpack-merge'
import { listWalletOrder, getWalletOrder, delWalletOrder, addWalletOrder, updateWalletOrder, getCurrDay } from "@/api/hash-wallet/walletOrder";
import UserInfoDialog from "../../components/dialog/UserInfoDialog.vue";
export default {
  name: "WalletOrder",
  dicts: ['wallet_type', 'in_status'],
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
      // 转换订单表格数据
      walletOrderList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        id: null,
        pageNum: 1,
        pageSize: 10,
        transactionNo: null,
        userId: null,
        sourceWalletType: null,
        toWalletType: null,
        paymentAddress: null,
        collectionAddress: null,
        status: null,
        createTime: null,
        orderByColumn: 'createTime',
        isAsc: 'desc'
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      currTrx: 0,
      currUsdt: 0
    };
  },
  created() {
    if (this.$route.query.orderId) {
      this.queryParams.id = this.$route.query.orderId
    }
    this.getList();
  },
  methods: {
    tableRowClassName({
      row,
      rowIndex,
    }) {
      if (row.status == 1) {
        return 'green'
      }
      return 'red'
    },
    sortChange(val) {
      console.log(val)
      if (val.order && val.order == 'descending') {
        this.queryParams.isAsc = 'desc'
      } else {
        this.queryParams.isAsc = 'asc'
      }
      this.queryParams.orderByColumn = val.prop && val.prop
      this.getList()
    },
    openUserDetail(userId) {
      this.openUser = true;
      this.userId = userId;
    },
    /** 查询转换订单列表 */
    getList() {
      this.loading = true;
      listWalletOrder(this.queryParams).then(response => {
        this.walletOrderList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      this.currUsdt = 0
      this.currTrx = 0
      getCurrDay().then(response => {
        response.rows.forEach(element => {
          if (element.toAmount) {
            if (element.toWalletType == 'USDT') {
              this.currUsdt = element.toAmount + this.currUsdt
            } else {
              this.currTrx = element.toAmount + this.currTrx
            }
          }
        });
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
        transactionNo: null,
        userId: null,
        sourceWalletType: null,
        toWalletType: null,
        paymentAddress: null,
        collectionAddress: null,
        sourceAmount: null,
        toAmount: null,
        minerAmount: null,
        status: null,
        createTime: null,
        updateTime: null,
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
      this.queryParams.id = null
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
      this.title = "添加转换订单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getWalletOrder(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改转换订单";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateWalletOrder(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addWalletOrder(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除转换订单编号为"' + ids + '"的数据项？').then(function () {
        return delWalletOrder(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('hash-wallet/walletOrder/export', {
        ...this.queryParams
      }, `walletOrder_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
<style  lang="scss" scoped>
.curr-money {
  height: 28.5px;
  line-height: 28.5px;
  display: flex;
  flex-direction: row;

  .money-text {
    margin-left: 10px;
    margin-right: 10px;
  }
}
</style>
