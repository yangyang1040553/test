<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="88px"
    >
      <el-form-item label="账单ID" prop="id">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入账单ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="usdt余额" prop="usdtAmount">
        <el-input
          v-model="queryParams.usdtAmount"
          placeholder="请输入usdt余额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="trx余额" prop="trxAmount">
        <el-input
          v-model="queryParams.trxAmount"
          placeholder="请输入trx余额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Usdt地址" prop="hashAddressUsdt">
        <el-input
          v-model="queryParams.hashAddressUsdt"
          placeholder="请输入Usdt的hash地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Trx地址" prop="hashAddressTrx">
        <el-input
          v-model="queryParams.hashAddressTrx"
          placeholder="请输入Trx的hash地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="总充值金额" prop="rechargeTotal">
        <el-input
          v-model="queryParams.rechargeTotal"
          placeholder="请输入总充值金额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="总提现金额" prop="withdrawTotal">
        <el-input
          v-model="queryParams.withdrawTotal"
          placeholder="请输入总提现金额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['hash-wallet:management:add']">新增</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['hash-wallet:management:edit']"
        >修改</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['hash-wallet:management:remove']">删除</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hash-wallet:management:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="managementList"
      @selection-change="handleSelectionChange"
      height="600"
    >
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="ID" align="center" prop="id" /> -->
      <el-table-column label="ID" align="center" prop="id">
        <template slot-scope="scope">
          <div class="global-text-blue" @click="openUserDetail(scope.row)">{{scope.row.id}}</div>
        </template>
      </el-table-column>
      <el-table-column label="usdt余额" align="center" prop="usdtAmount" />
      <el-table-column label="trx余额" align="center" prop="trxAmount" />
      <el-table-column label="Usdt的hash地址" align="center" prop="hashAddressUsdt" />
      <el-table-column label="Trx的hash地址" align="center" prop="hashAddressTrx" />
      <el-table-column label="总充值金额" align="center" prop="rechargeTotal" />
      <el-table-column label="总提现金额" align="center" prop="withdrawTotal" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-detail"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['hash-wallet:management:edit']"
          >详情</el-button>
          <!-- <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
          v-hasPermi="['hash-wallet:management:remove']">删除</el-button>-->
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

    <!-- 添加或修改用户钱包对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" label-width="100px" disabled>
        <el-form-item label="usdt余额" prop="usdtAmount">
          <el-input v-model="form.usdtAmount" placeholder="usdt余额" />
        </el-form-item>
        <el-form-item label="trx余额" prop="trxAmount">
          <el-input v-model="form.trxAmount" placeholder="trx余额" />
        </el-form-item>
        <el-form-item label="Usdt地址" prop="hashAddressUsdt">
          <el-input v-model="form.hashAddressUsdt" placeholder="Usdt的hash地址" />
        </el-form-item>
        <el-form-item label="Trx地址" prop="hashAddressTrx">
          <el-input v-model="form.hashAddressTrx" placeholder="Trx的hash地址" />
        </el-form-item>
        <el-form-item label="总充值金额" prop="rechargeTotal">
          <el-input v-model="form.rechargeTotal" placeholder="总充值金额" />
        </el-form-item>
        <el-form-item label="总提现金额" prop="withdrawTotal">
          <el-input v-model="form.withdrawTotal" placeholder="总提现金额" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">关 闭</el-button>
      </div>
    </el-dialog>

    <UserInfoDialog v-if="openUser" :open="openUser" :id="userId" @close="openUser=false" />
  </div>
</template>

<script>
import { listManagement, getManagement, delManagement, addManagement, updateManagement } from "@/api/hash-wallet/management";
import UserInfoDialog from "../../components/dialog/UserInfoDialog.vue";
export default {
  name: "Management",
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
      // 用户钱包表格数据
      managementList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        id: null,
        pageNum: 1,
        pageSize: 10,
        usdtAmount: null,
        trxAmount: null,
        hashAddressUsdt: null,
        hashAddressTrx: null,
        rechargeTotal: null,
        withdrawTotal: null
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
    openUserDetail(row) {
      this.openUser = true;
      this.userId = row.id;
    },
    /** 查询用户钱包列表 */
    getList() {
      this.loading = true;
      listManagement(this.queryParams).then(response => {
        this.managementList = response.rows;
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
        usdtAmount: null,
        trxAmount: null,
        hashAddressUsdt: null,
        hashAddressTrx: null,
        rechargeTotal: null,
        withdrawTotal: null
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
      this.title = "用户钱包";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getManagement(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "用户钱包";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateManagement(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addManagement(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除用户钱包编号为"' + ids + '"的数据项？').then(function () {
        return delManagement(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('hash-wallet/management/export', {
        ...this.queryParams
      }, `management_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
