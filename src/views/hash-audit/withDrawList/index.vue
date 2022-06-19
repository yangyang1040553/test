<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="订单id" prop="id">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入订单id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="交易号" prop="transactionNo">
        <el-input
          v-model="queryParams.transactionNo"
          placeholder="请输入交易号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <el-form-item label="玩家id" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入玩家id"
          clearable
          @keyup.enter.native="handleQuery"
        />
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
      <!-- <el-form-item label="付款地址" prop="paymentAddress">
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
      </el-form-item>-->
      <!-- <el-form-item label="提现的金额" prop="amount">
        <el-input
          v-model="queryParams.amount"
          placeholder="请输入提现的金额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="矿工费" prop="minerAmount">
        <el-input
          v-model="queryParams.minerAmount"
          placeholder="请输入矿工费"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <el-form-item label="订单状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态订单状态" clearable>
          <el-option
            v-for="dict in dict.type.order_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态" prop="checkStatus">
        <el-select v-model="queryParams.checkStatus" placeholder="请选择审核状态" clearable>
          <el-option
            v-show="dict.value>=2"
            v-for="dict in dict.type.check_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="审核人" prop="checkPerson">
        <el-input
          v-model="queryParams.checkPerson"
          placeholder="请输入审核人"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
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
          v-hasPermi="['hash-audit:auditWidthdrawOrder:add']"
        >新增</el-button>
      </el-col>-->
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['hash-audit:auditWidthdrawOrder:edit']"
        >修改</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['hash-audit:auditWidthdrawOrder:remove']"
        >删除</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hash-audit:auditWidthdrawOrder:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="auditWidthdrawOrderList"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
      height="600"
    >
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="订单id" align="center" prop="id" width="180" />
      <el-table-column label="交易号" align="center" prop="transactionNo" width="180" />
      <el-table-column label="玩家id" align="center" prop="userId" width="180">
        <template slot-scope="scope">
          <div
            class="global-text-blue"
            @click="openUserDetail(scope.row.userId)"
          >{{scope.row.userId}}</div>
        </template>
      </el-table-column>
      <el-table-column label="钱包类型" align="center" prop="walletType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.wallet_type" :value="scope.row.walletType" />
        </template>
      </el-table-column>
      <el-table-column label="付款地址" align="center" prop="paymentAddress" width="180" />
      <el-table-column label="收款地址" align="center" prop="collectionAddress" width="180" />
      <el-table-column label="提现金额" align="center" prop="amount">
        <template slot-scope="scope">
          <div>{{(scope.row.amount*1.0/10000).toFixed(2)}}</div>
        </template>
      </el-table-column> '
      <el-table-column label="到账金额" align="center" prop="payAmount">
        <template slot-scope="scope">
          <div>{{(scope.row.payAmount*1.0/10000).toFixed(2)}}</div>
        </template>
      </el-table-column>
      <el-table-column label="说明" align="center" prop="note" />
      <el-table-column label="矿工费" align="center" prop="minerAmount" />
      <el-table-column label="订单状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.order_status" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="审核状态" align="center" prop="checkStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.check_status" :value="scope.row.checkStatus" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" sortable width="180" />
      <el-table-column label="更新时间" align="center" prop="updateTime" sortable width="180" />
      <el-table-column label="审核人" align="center" prop="checkPerson" />
      <el-table-column label="后台备注" align="center" prop="remark" width="180" />
      <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['hash-audit:auditWidthdrawOrder:edit']"
          >审核</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['hash-audit:auditWidthdrawOrder:remove']"
          >查询流水</el-button>
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

    <!-- 添加或修改提现审核对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="审核状态" prop="checkStatus">
          <el-select v-model="form.checkStatus" placeholder="请选择审核状态">
            <el-option
              :disabled="dict.value <=1"
              v-for="dict in dict.type.check_status"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="后台备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入后台备注" />
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
import { listAuditWidthdrawOrder, getAuditWidthdrawOrder, delAuditWidthdrawOrder, addAuditWidthdrawOrder, updateAuditWidthdrawOrder } from "@/api/hash-audit/auditWidthdrawOrder";
import UserInfoDialog from "../../components/dialog/UserInfoDialog.vue";
export default {
  name: "AuditWidthdrawOrder",
  dicts: ['check_status', 'wallet_type', 'order_status'],
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
      // 提现审核表格数据
      auditWidthdrawOrderList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        id: null,
        pageNum: 1,
        pageSize: 10,
        id: null,
        transactionNo: null,
        userId: null,
        walletType: null,
        paymentAddress: null,
        collectionAddress: null,
        amount: null,
        minerAmount: null,
        status: null,
        checkStatus: "3",
        checkPerson: null,
        createTime: null,
        orderByColumn: 'createTime',
        isAsc: 'asc',
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    if (this.$route.query.orderId) {
      this.queryParams.id = this.$route.query.orderId
    }
    this.getList();
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
    /** 查询提现审核列表 */
    getList() {
      this.loading = true;
      listAuditWidthdrawOrder(this.queryParams).then(response => {
        this.auditWidthdrawOrderList = response.rows;
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
        transactionNo: null,
        userId: null,
        walletType: null,
        paymentAddress: null,
        collectionAddress: null,
        amount: null,
        minerAmount: null,
        status: null,
        checkStatus: "3",
        checkPerson: null,
        remark: null,
        createTime: null,
        updateTime: null,
        updateBy: null,
        orderByColumn: 'createTime',
        isAsc: 'asc',
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
      this.title = "添加提现审核";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getAuditWidthdrawOrder(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改提现审核";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateAuditWidthdrawOrder(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addAuditWidthdrawOrder(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除提现审核编号为"' + ids + '"的数据项？').then(function () {
        return delAuditWidthdrawOrder(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('hash-audit/auditWidthdrawOrder/export', {
        ...this.queryParams
      }, `auditWidthdrawOrder_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
