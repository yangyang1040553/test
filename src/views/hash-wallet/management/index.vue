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
      <el-form-item label="玩家ID" prop="id">
        <el-input
          v-model="queryParams.id"
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
      <!-- <el-form-item label="usdt余额" prop="usdtAmount">
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
      </el-form-item>-->
      <el-form-item label="Usdt地址" prop="hashAddressUsdt">
        <el-input
          v-model="queryParams.hashAddressUsdt"
          placeholder="请输入TRC地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="TRC转换地址" prop="hashTransAddressTrx">
        <el-input
          v-model="queryParams.hashTransAddressTrx"
          placeholder="请输入Trx的hash地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="总充值金额" prop="rechargeTotal">
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
      </el-form-item>-->
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
          <div class="global-text-blue" @click="openUserDetail(scope.row.id)">{{scope.row.id}}</div>
        </template>
      </el-table-column>
      <el-table-column label="昵称" align="center" prop="nickName" />
      <el-table-column label="邀请码" align="center" prop="invitationCode" width="100">
        <template slot-scope="scope">
          <div
            v-if="queryParams.invitationCode==scope.row.invitationCode"
            class="global-text-green"
          >{{scope.row.invitationCode||"-"}}</div>
          <div v-else>{{scope.row.invitationCode||"-"}}</div>
        </template>
      </el-table-column>
      <el-table-column label="usdt余额" align="center" prop="usdtAmount">
        <template slot-scope="scope">
          <div>{{scope.row.usdtAmount || '-'}}</div>
        </template>
      </el-table-column>
      <el-table-column label="usdt远程余额" align="center" prop="usdtRemoteAmount">
        <template slot-scope="scope">
          <div>{{scope.row.usdtRemoteAmount || '-'}}</div>
        </template>
      </el-table-column>
      <el-table-column label="trx余额" align="center" prop="trxAmount">
        <template slot-scope="scope">
          <div>{{scope.row.trxAmount || '-'}}</div>
        </template>
      </el-table-column>
      <el-table-column label="trx远程余额" align="center" prop="trxRemoteAmount">
        <template slot-scope="scope">
          <div>{{scope.row.trxRemoteAmount || '-'}}</div>
        </template>
      </el-table-column>
      <el-table-column label="TRC地址" align="center" prop="hashAddressUsdt" />
      <el-table-column label="TRC转换地址" align="center" prop="hashTransAddressTrx" />
      <el-table-column label="USDT总充值金额" align="center" prop="usdtRechargeTotal">
        <template slot-scope="scope">
          <div>{{scope.row.usdtRechargeTotal || '-'}}</div>
        </template>
      </el-table-column>
      <el-table-column label="TRX总充值金额" align="center" prop="trxRechargeTotal">
        <template slot-scope="scope">
          <div>{{scope.row.trxRechargeTotal || '-'}}</div>
        </template>
      </el-table-column>
      <el-table-column label="USDT总提现金额" align="center" prop="usdtWithdrawTotal">
        <template slot-scope="scope">
          <div>{{scope.row.usdtWithdrawTotal || '-'}}</div>
        </template>
      </el-table-column>
      <el-table-column label="TRX总提现金额" align="center" prop="trxWithdrawTotal">
        <template slot-scope="scope">
          <div>{{scope.row.trxWithdrawTotal || '-'}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-detail"
            @click="handleUpdate(scope.row,false)"
            v-hasPermi="['hash-wallet:management:edit']"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleOpenEdit(scope.row)"
            v-hasPermi="['hash-wallet:management:edit']"
          >出入款</el-button>
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
      <el-form ref="form" :model="form" label-width="140px">
        <el-form-item label="usdt余额" prop="usdtAmount">
          <el-input v-model="form.usdtAmount" placeholder="usdt余额" />
        </el-form-item>
        <el-form-item label="trx余额" prop="trxAmount">
          <el-input v-model="form.trxAmount" placeholder="trx余额" />
        </el-form-item>
        <el-form-item label="TRC地址" prop="hashAddressUsdt">
          <el-input v-model="form.hashAddressUsdt" placeholder="TRC地址" />
        </el-form-item>
        <el-form-item label="TRC转换地址" prop="hashTransAddressTrx">
          <el-input v-model="form.hashTransAddressTrx" placeholder="TRC转换地址" />
        </el-form-item>
        <el-form-item label="USDT总充值金额" prop="rechargeTotal">
          <el-input v-model="form.usdtRechargeTotal" placeholder="USDT总充值金额" />
        </el-form-item>
        <el-form-item label="TRX总充值金额" prop="rechargeTotal">
          <el-input v-model="form.trxRechargeTotal" placeholder="TRX总充值金额" />
        </el-form-item>
        <el-form-item label="USDT总提现金额" prop="withdrawTotal">
          <el-input v-model="form.usdtWithdrawTotal" placeholder="USDT总提现金额" />
        </el-form-item>
        <el-form-item label="TRX总提现金额" prop="withdrawTotal">
          <el-input v-model="form.trxWithdrawTotal" placeholder="TRX总提现金额" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">关 闭</el-button>
      </div>
    </el-dialog>

    <el-dialog title="送钱" :visible.sync="openEdit" width="800px" append-to-body>
      <el-form ref="editForm" :model="editForm" label-width="100px" :rules="rules">
        <el-form-item label="出入款" prop="type">
          <!-- <el-input v-model="editForm.walletType" placeholder="请选择钱包类型" /> -->
          <el-select v-model="editForm.type" placeholder="请选择钱包类型" clearable>
            <el-option
              v-for="dict in types"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="钱包类型" prop="walletType">
          <!-- <el-input v-model="editForm.walletType" placeholder="请选择钱包类型" /> -->
          <el-select v-model="editForm.walletType" placeholder="请选择钱包类型" clearable>
            <el-option
              v-for="dict in dict.type.wallet_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="金额" prop="amount">
          <el-input
            v-model="editForm.amount"
            oninput="value=value.replace(/[^\d\.]/g,'')"
            placeholder="请输入充值金额"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitEdit">确 定</el-button>
        <el-button @click="openEdit=false">关 闭</el-button>
      </div>
    </el-dialog>

    <UserInfoDialog v-if="openUser" :open="openUser" :id="userId" @close="openUser=false" />
  </div>
</template>

<script>
import merge from 'webpack-merge'
import { listManagement, getManagement, delManagement, addManagement, updateManagement } from "@/api/hash-wallet/management";
import UserInfoDialog from "../../components/dialog/UserInfoDialog.vue";
export default {
  name: "Management",
  dicts: ['wallet_type'],
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
      //是否编辑
      isEdit: false,
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
      types: [
        { label: '出款', value: 1 },
        { label: '入款', value: 2 }
      ],
      // 查询参数
      queryParams: {
        id: null,
        pageNum: 1,
        pageSize: 10,
        usdtAmount: null,
        trxAmount: null,
        hashAddressUsdt: null,
        hashTransAddressTrx: null,
        rechargeTotal: null,
        withdrawTotal: null,
        invitationCode: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        walletType: [{ required: true, message: '请选择钱包类型', trigger: 'blur' }],
        amount: [{ required: true, message: '请输入金额', trigger: 'blur' }],
        type: [{ required: true, message: '请选择类型', trigger: 'blur' }],
      },
      openEdit: false,
      editForm: {}
    };
  },
  created() {
    if (this.$route.query.userId) {
      this.queryParams.id = this.$route.query.userId
    }
    this.getList();
  },
  methods: {
    handleOpenEdit(row) {
      this.reset();
      this.openEdit = true;
      this.editForm.id = row.id
    },
    openUserDetail(userId) {
      this.openUser = true;
      this.userId = userId;
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
        hashTransAddressTrx: null,
        rechargeTotal: null,
        withdrawTotal: null,
        invitationCode: null
      };
      this.resetForm("form");
      this.resetForm("editForm");

    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.$router.push({ query: merge({}, {}) })
      this.resetForm("queryForm");
      this.queryParams.id = ''
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
    handleUpdate(row, isEdit) {
      this.reset();
      this.isEdit = isEdit;
      const id = row.id || this.ids
      getManagement(id).then(response => {
        this.form = response.data;
        this.open = true;
        if (this.isEdit) {
          this.title = "编辑用户钱包";
        } else {
          this.title = "用户钱包";
        }
      });
    },
    submitEdit() {
      this.$refs["editForm"].validate(valid => {
        if (valid) {
          if (this.editForm.id != null) {
            console.log(this.editForm)
            if (this.editForm.type == 1) {
              //出款乘以 -1
              this.editForm.amount = this.editForm.amount * -1
            }
            updateManagement(this.editForm).then(response => {
              this.$modal.msgSuccess("提交成功");
              this.openEdit = false;
              this.getList();
              this.resetForm("editForm");
            });
          }
        }
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
