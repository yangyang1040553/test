<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="订单ID" prop="id">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入订单ID"
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
      <el-form-item label="邀请码" prop="invitation_code">
        <el-input
          v-model="queryParams.invitation_code"
          placeholder="请输入邀请码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="目标钱包类型" prop="toWallet">
        <el-select v-model="queryParams.toWallet" placeholder="请选择目标钱包类型" clearable>
          <el-option
            v-for="dict in dict.type.wallet_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="转换状态" prop="transStatus">
        <el-select v-model="queryParams.transStatus" placeholder="请选择转换状态" clearable>
          <el-option
            v-for="dict in dict.type.trans_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="充值金额" prop="rechargeMoney">
        <el-input
          v-model="queryParams.rechargeMoney"
          placeholder="请输入充值金额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <el-form-item label=" 支付状态" prop="payStatus">
        <el-select v-model="queryParams.payStatus" placeholder="请选择支付状态" clearable>
          <el-option
            v-for="dict in dict.type.pay_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label=" 订单状态" prop="orderStatus">
        <el-select v-model="queryParams.orderStatus" placeholder="请选择订单状态" clearable>
          <el-option
            v-for="dict in dict.type.samll_order_status"
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
          v-hasPermi="['hash-wallet:smallOrder:add']"
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
          v-hasPermi="['hash-wallet:smallOrder:edit']"
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
          v-hasPermi="['hash-wallet:smallOrder:remove']"
        >删除</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hash-wallet:smallOrder:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      height="580"
      v-loading="loading"
      :data="smallOrderList"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
      border
    >
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <!-- <el-table-column label="用户ID" align="center" prop="userId" /> -->
      <el-table-column label="创建时间" align="center" prop="createTime" width="180" sortable></el-table-column>
      <el-table-column label="支付时间" align="center" prop="payTime" width="180" sortable></el-table-column>
      <el-table-column label="失效时间" align="center" prop="invalidTime" width="180" sortable></el-table-column>
      <el-table-column label="用户ID" align="center" prop="userId" width="160">
        <template slot-scope="scope">
          <div
            class="global-text-blue"
            @click="openUserDetail(scope.row.userId)"
          >{{scope.row.userId}}</div>
        </template>
      </el-table-column>
      <el-table-column label="用户昵称" align="center" prop="nickName" />
      <el-table-column label="邀请码" align="center" prop="invitation_code" />
      <el-table-column label="通道ID" align="center" prop="channelId" />
      <el-table-column label="商户编号" align="center" prop="rechargeMerchantCode">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.merchant_code" :value="scope.row.rechargeMerchantCode" />
        </template>
      </el-table-column>
      <el-table-column label="钱包类型" align="center" prop="toWallet">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.wallet_type" :value="scope.row.toWallet" />
        </template>
      </el-table-column>
      <el-table-column label="转换状态" align="center" prop="transStatus" width="100">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.trans_status" :value="scope.row.transStatus" />
        </template>
      </el-table-column>
      <el-table-column label="转换比例" align="center" prop="scale" />
      <el-table-column label="充值金额" align="center" prop="rechargeMoney" sortable width="160" />
      <el-table-column label="支付金额" align="center" prop="payMoney" sortable width="160" />
      <el-table-column label="支付状态" align="center" prop="payStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.pay_status" :value="scope.row.payStatus" />
        </template>
      </el-table-column>
      <el-table-column label="订单状态" align="center" prop="orderStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.samll_order_status" :value="scope.row.orderStatus" />
        </template>
      </el-table-column>
      <el-table-column label="支付类型" align="center" prop="payTypeNo" />
      <el-table-column label="通道编码" align="center" prop="channelCode" />
      <!-- <el-table-column label="渠道编码" align="center" prop="channelNo" /> -->

      <el-table-column label="三方支付" align="center" prop="thirdOrderNo" />
      <el-table-column label="备注" align="center" prop="remark" />
      <!-- <el-table-column label="支付跳转地址" align="center" prop="payUrl" /> -->
      <!-- <el-table-column label="请求报文" align="center" prop="reqMessage" /> -->
      <el-table-column label="回调报文" align="center" prop="callbackMessage" />
      <!-- <el-table-column label="注册渠道" align="center" prop="regChannel" /> -->
      <!-- <el-table-column label="操作人" align="center" prop="updateUser" /> -->
      <el-table-column label="订单ID" align="center" prop="id" width="210" />

      <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['hash-wallet:smallOrder:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['hash-wallet:smallOrder:remove']"
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

    <!-- 添加或修改充值订单记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickName">
          <el-input v-model="form.nickName" placeholder="请输入用户昵称" />
        </el-form-item>
        <el-form-item label="商户编号" prop="rechargeMerchantCode">
          <el-input v-model="form.rechargeMerchantCode" placeholder="请输入商户编号" />
        </el-form-item>
        <el-form-item label="目标钱包类型" prop="toWallet">
          <el-select v-model="form.toWallet" placeholder="请选择目标钱包类型">
            <el-option
              v-for="dict in dict.type.wallet_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="转换状态 0=未转换 1=转换中 2=转换失败 3=转换成功" prop="transStatus">
          <el-select v-model="form.transStatus" placeholder="请选择转换状态 0=未转换 1=转换中 2=转换失败 3=转换成功">
            <el-option
              v-for="dict in dict.type.trans_status"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="转换比例" prop="scale">
          <el-input v-model="form.scale" placeholder="请输入转换比例" />
        </el-form-item>
        <el-form-item label="充值金额" prop="rechargeMoney">
          <el-input v-model="form.rechargeMoney" placeholder="请输入充值金额" />
        </el-form-item>
        <el-form-item label="支付金额" prop="payMoney">
          <el-input v-model="form.payMoney" placeholder="请输入支付金额" />
        </el-form-item>
        <el-form-item label="0:首充 1:非首充" prop="isFirstRecharge">
          <el-input v-model="form.isFirstRecharge" placeholder="请输入0:首充 1:非首充" />
        </el-form-item>
        <el-form-item label=" 支付状态 0=未支付 1=已支付 2=已取消" prop="payStatus">
          <el-select v-model="form.payStatus" placeholder="请选择 支付状态 0=未支付 1=已支付 2=已取消">
            <el-option
              v-for="dict in dict.type.pay_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label=" 订单状态 0=未处理 1=已完成 2=已关闭 3=已取消" prop="orderStatus">
          <el-select v-model="form.orderStatus" placeholder="请选择 订单状态 0=未处理 1=已完成 2=已关闭 3=已取消">
            <el-option
              v-for="dict in dict.type.samll_order_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label=" 支付类型关联支付类型表" prop="payTypeNo">
          <el-input v-model="form.payTypeNo" placeholder="请输入 支付类型关联支付类型表" />
        </el-form-item>
        <el-form-item label="通道编码" prop="channelCode">
          <el-input v-model="form.channelCode" placeholder="请输入通道编码" />
        </el-form-item>
        <el-form-item label="渠道编码" prop="channelNo">
          <el-input v-model="form.channelNo" placeholder="请输入渠道编码" />
        </el-form-item>
        <el-form-item label="支付时间" prop="payTime">
          <el-date-picker
            clearable
            v-model="form.payTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择支付时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="失效时间" prop="invalidTime">
          <el-date-picker
            clearable
            v-model="form.invalidTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择失效时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="三方支付流水编号" prop="thirdOrderNo">
          <el-input v-model="form.thirdOrderNo" placeholder="请输入三方支付流水编号" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="支付跳转地址" prop="payUrl">
          <el-input v-model="form.payUrl" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="请求报文" prop="reqMessage">
          <el-input v-model="form.reqMessage" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="回调报文" prop="callbackMessage">
          <el-input v-model="form.callbackMessage" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="注册渠道" prop="regChannel">
          <el-input v-model="form.regChannel" placeholder="请输入注册渠道" />
        </el-form-item>
        <el-form-item label="操作人" prop="updateUser">
          <el-input v-model="form.updateUser" placeholder="请输入操作人" />
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
import { listSmallOrder, getSmallOrder, delSmallOrder, addSmallOrder, updateSmallOrder } from "@/api/hash-wallet/smallOrder";
import UserInfoDialog from "../../components/dialog/UserInfoDialog.vue";
export default {
  name: "SmallOrder",
  dicts: ['pay_status', 'wallet_type', 'trans_status', 'samll_order_status', 'merchant_code'],
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
      // 充值订单记录表格数据
      smallOrderList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        toWallet: null,
        transStatus: null,
        rechargeMoney: null,
        payStatus: null,
        orderStatus: null,
        createTime: null,
        invitation_code: null,
        orderByColumn: 'createTime',
        isAsc: 'desc',
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
    /** 查询充值订单记录列表 */
    getList() {
      this.loading = true;
      listSmallOrder(this.queryParams).then(response => {
        this.smallOrderList = response.rows;
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
        nickName: null,
        channelId: null,
        rechargeMerchantCode: null,
        toWallet: null,
        transStatus: null,
        scale: null,
        rechargeMoney: null,
        payMoney: null,
        isFirstRecharge: null,
        payStatus: null,
        invitation_code: null,
        orderStatus: null,
        payTypeNo: null,
        channelCode: null,
        channelNo: null,
        payTime: null,
        invalidTime: null,
        thirdOrderNo: null,
        remark: null,
        payUrl: null,
        reqMessage: null,
        callbackMessage: null,
        regChannel: null,
        delFlag: null,
        updateUser: null,
        createTime: null,
        updateTime: null,
        orderByColumn: 'createTime',
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
      this.title = "添加充值订单记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getSmallOrder(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改充值订单记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateSmallOrder(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSmallOrder(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除充值订单记录编号为"' + ids + '"的数据项？').then(function () {
        return delSmallOrder(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      let obj = { ...this.queryParams }
      obj.pageSize = 5000
      this.download('hash-wallet/smallOrder/export', obj, `smallOrder_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
