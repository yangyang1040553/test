<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="日期" prop="id">
        <el-date-picker
          clearable
          v-model="queryParams.id"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="用户ID" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入用户ID"
          clearable
          oninput="value=value.replace(/[^\d\.]/g,'')"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="邀请码" prop="invitationCode">
        <el-input
          v-model="queryParams.invitationCode"
          placeholder="请输入邀请码"
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
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['hash-statistical:prototeIncome:add']"
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
          v-hasPermi="['hash-statistical:prototeIncome:edit']"
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
          v-hasPermi="['hash-statistical:prototeIncome:remove']"
        >删除</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hash-statistical:prototeIncome:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="prototeIncomeList"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
      height="600"
      border
    >
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="日期" align="center" prop="id" width="120" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户ID" align="center" prop="userId" width="160">
        <template slot-scope="scope">
          <div
            class="global-text-blue"
            @click="openUserDetail(scope.row.userId)"
          >{{scope.row.userId}}</div>
        </template>
      </el-table-column>
      <el-table-column label="邀请码" align="center" prop="invitationCode" width="90">
        <template slot-scope="scope">
          <div
            v-if="queryParams.invitationCode==scope.row.invitationCode"
            class="global-text-green"
          >{{scope.row.invitationCode||"-"}}</div>
          <div v-else>{{scope.row.invitationCode||"-"}}</div>
        </template>
      </el-table-column>
      <el-table-column label="USDT收益金额" align="center" prop="usdtIncomeAmount" sortable  width="140" />
      <el-table-column label="USDT一级代理收益金额" align="center" prop="usdt_income1_amount" sortable width="190">
        <template slot-scope="scope">
          <div>{{scope.row.usdt_income1_amount||"-"}}</div>
        </template>
      </el-table-column>
      <el-table-column label="USDT二级代理收益金额" align="center" prop="usdt_income2_amount" sortable width="190">
        <template slot-scope="scope">
          <div>{{scope.row.usdt_income2_amount||"-"}}</div>
        </template>
      </el-table-column>
      <el-table-column label="USDT三级代理收益金额" align="center" prop="usdt_income3_amount" sortable width="190">
        <template slot-scope="scope">
          <div>{{scope.row.usdt_income3_amount||"-"}}</div>
        </template>
      </el-table-column>
      <el-table-column label="TRX收益金额" align="center" prop="trxIncomeAmount" sortable width="160"/>
      <el-table-column label="TRX一级代理收益金额" align="center" prop="trx_income1_amount" sortable width="190">
        <template slot-scope="scope">
          <div>{{scope.row.trx_income1_amount||"-"}}</div>
        </template>
      </el-table-column>
      <el-table-column label="TRX二级代理收益金额" align="center" prop="trx_income2_amount" sortable width="190">
        <template slot-scope="scope">
          <div>{{scope.row.trx_income2_amount||"-"}}</div>
        </template>
      </el-table-column>
      <el-table-column label="TRX三级代理收益金额" align="center" prop="trx_income3_amount" sortable width="190">
        <template slot-scope="scope">
          <div>{{scope.row.trx_income3_amount||"-"}}</div>
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['hash-statistical:prototeIncome:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['hash-statistical:prototeIncome:remove']"
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

    <!-- 添加或修改代理每日收益金额对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="id-天为单位" prop="id">
          <el-date-picker
            clearable
            v-model="form.id"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择id-天为单位"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="邀请码" prop="invitationCode">
          <el-input v-model="form.invitationCode" placeholder="请输入邀请码" />
        </el-form-item>
        <el-form-item label="usdt收益金额" prop="usdtIncomeAmount">
          <el-input v-model="form.usdtIncomeAmount" placeholder="请输入usdt收益金额" />
        </el-form-item>
        <el-form-item label="trx收益金额" prop="trxIncomeAmount">
          <el-input v-model="form.trxIncomeAmount" placeholder="请输入trx收益金额" />
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
import { listPrototeIncome, getPrototeIncome, delPrototeIncome, addPrototeIncome, updatePrototeIncome } from "@/api/hash-statistical/prototeIncome";
import UserInfoDialog from "../../components/dialog/UserInfoDialog.vue";
export default {
  name: "PrototeIncome",
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
      // 代理每日收益金额表格数据
      prototeIncomeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: null,
        userId: null,
        invitationCode: null,
        orderByColumn: 'id',
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
    /** 查询代理每日收益金额列表 */
    getList() {
      this.loading = true;
      listPrototeIncome(this.queryParams).then(response => {
        this.prototeIncomeList = response.rows;
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
        invitationCode: null,
        usdtIncomeAmount: null,
        trxIncomeAmount: null,
        orderByColumn: 'id',
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
      this.title = "添加代理每日收益金额";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getPrototeIncome(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改代理每日收益金额";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updatePrototeIncome(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPrototeIncome(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除代理每日收益金额编号为"' + ids + '"的数据项？').then(function () {
        return delPrototeIncome(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('hash-statistical/prototeIncome/export', {
        ...this.queryParams
      }, `prototeIncome_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
