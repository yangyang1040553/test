<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" >
      <el-form-item label="订单id" prop="id">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入订单id"
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
      <el-form-item label="钱包地址" prop="walletAddress">
        <el-input
          v-model="queryParams.walletAddress"
          placeholder="请输入钱包地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="提现状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择提现状态" clearable>
          <el-option
            v-for="dict in dict.type.withdraw_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="提现时间" prop="createTime">
        <el-date-picker clearable
          v-model="queryParams.createTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择充值时间">
        </el-date-picker>
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
          v-hasPermi="['hash-wallet:walletWidthdrawOrder:add']"
        >新增</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['hash-wallet:walletWidthdrawOrder:edit']"
        >修改</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['hash-wallet:walletWidthdrawOrder:remove']"
        >删除</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hash-wallet:walletWidthdrawOrder:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="walletWidthdrawOrderList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="订单id" align="center" prop="id" />
      <el-table-column label="钱包类型USDT TRX" align="center" prop="walletType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.wallet_type" :value="scope.row.walletType"/>
        </template>
      </el-table-column>
      <el-table-column label="钱包地址" align="center" prop="walletAddress" />
      <el-table-column label="提现的金额" align="center" prop="amount" />
      <el-table-column label="提现状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.withdraw_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="充值时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="到账时间" align="center" prop="updateTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['hash-wallet:walletWidthdrawOrder:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['hash-wallet:walletWidthdrawOrder:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改提现审核对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="钱包类型USDT TRX" prop="walletType">
          <el-select v-model="form.walletType" placeholder="请选择钱包类型USDT TRX">
            <el-option
              v-for="dict in dict.type.wallet_type"
              :key="dict.value"
              :label="dict.label"
:value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="钱包地址" prop="walletAddress">
          <el-input v-model="form.walletAddress" placeholder="请输入钱包地址" />
        </el-form-item>
        <el-form-item label="提现的金额" prop="amount">
          <el-input v-model="form.amount" placeholder="请输入提现的金额" />
        </el-form-item>
        <el-form-item label="提现状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择提现状态">
            <el-option
              v-for="dict in dict.type.withdraw_status"
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
import { listWalletWidthdrawOrder, getWalletWidthdrawOrder, delWalletWidthdrawOrder, addWalletWidthdrawOrder, updateWalletWidthdrawOrder } from "@/api/hash-wallet/walletWidthdrawOrder";

export default {
  name: "WalletWidthdrawOrder",
  dicts: ['wallet_type', 'withdraw_status'],
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
      // 提现审核表格数据
      walletWidthdrawOrderList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: null,
        walletType: null,
        walletAddress: null,
        status: null,
        createTime: null,
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
    /** 查询提现审核列表 */
    getList() {
      this.loading = true;
      listWalletWidthdrawOrder(this.queryParams).then(response => {
        this.walletWidthdrawOrderList = response.rows;
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
        walletType: null,
        walletAddress: null,
        amount: null,
        status: null,
        createTime: null,
        updateTime: null
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
      this.single = selection.length!==1
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
      getWalletWidthdrawOrder(id).then(response => {
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
            updateWalletWidthdrawOrder(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addWalletWidthdrawOrder(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除提现审核编号为"' + ids + '"的数据项？').then(function() {
        return delWalletWidthdrawOrder(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('hash-wallet/walletWidthdrawOrder/export', {
        ...this.queryParams
      }, `walletWidthdrawOrder_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
