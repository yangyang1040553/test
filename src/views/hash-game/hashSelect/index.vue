<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="玩家ID" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入玩家ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="玩家昵称" prop="nickName">
        <el-input
          v-model="queryParams.nickName"
          placeholder="请输入玩家昵称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <el-form-item label="邀请码" prop="invitationCode">
        <el-input
          v-model="queryParams.invitationCode"
          placeholder="请输入邀请码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单号" prop="orderId">
        <el-input
          v-model="queryParams.orderId"
          placeholder="请输入订单号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="哈希值" prop="hashValue">
        <el-input
          v-model="queryParams.hashValue"
          placeholder="请输入哈希值"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <!-- <el-form-item label="下注金额" prop="betAmount">
        <el-input
          v-model="queryParams.betAmount"
          placeholder="请输入下注金额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
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
      <el-form-item label="下注结果" prop="betResult">
        <el-select v-model="queryParams.betResult" placeholder="请选择下注结果" clearable>
          <el-option
            v-for="dict in dict.type.bet_result"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
        <el-form-item label="创建时间" prop="createTime">
          <el-date-picker
            clearable
            v-model="queryParams.createTime"
            type="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择创建时间"
          ></el-date-picker>
        </el-form-item>
      </el-form-item>
      <!-- <el-form-item label="游戏汇总" prop="gameCollect">
        <el-input
          v-model="queryParams.gameCollect"
          placeholder="请输入游戏汇总"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <el-form-item style="width:160px;">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="6" class="mb8">
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['hash-game:hashSelect:add']"
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
          v-hasPermi="['hash-game:hashSelect:edit']"
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
          v-hasPermi="['hash-game:hashSelect:remove']"
        >删除</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hash-game:hashSelect:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      height="580"
      :data="hashSelectList"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
      border
    >
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="唯一id" align="center" prop="id" width="100" />
      <el-table-column label="玩家ID" align="center" prop="userId" width="180">
        <template slot-scope="scope">
          <div
            class="global-text-blue"
            @click="openUserDetail(scope.row.userId)"
          >{{scope.row.userId}}</div>
        </template>
      </el-table-column>
      <el-table-column label="玩家昵称" align="center" prop="nickName" width="90" />
      <el-table-column label="邀请码" align="center" prop="invitationCode" width="90" />
      <el-table-column label="订单号" align="center" prop="orderId" />
      <el-table-column label="哈希值" align="center" prop="hashValue" />
      <el-table-column label="下注金额" align="center" prop="betAmount" sortable width="100" />
      <el-table-column label="钱包类型" align="center" prop="walletType" width="100" sortable>
        <template slot-scope="scope">
          <dict-tag :options="dict.type.wallet_type" :value="scope.row.walletType" />
        </template>
      </el-table-column>
      <el-table-column label="下注结果" align="center" prop="betResult" width="100">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.bet_result" :value="scope.row.betResult" />
        </template>
      </el-table-column>
      <el-table-column label="游戏汇总" align="center" prop="gameCollect" width="90" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180" sortable></el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改哈希查询记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="玩家ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入玩家ID" />
        </el-form-item>
        <el-form-item label="玩家昵称" prop="nickName">
          <el-input v-model="form.nickName" placeholder="请输入玩家昵称" />
        </el-form-item>
        <el-form-item label="邀请码" prop="invitationCode">
          <el-input v-model="form.invitationCode" placeholder="请输入邀请码" />
        </el-form-item>
        <el-form-item label="订单号" prop="orderId">
          <el-input v-model="form.orderId" placeholder="请输入订单号" />
        </el-form-item>
        <el-form-item label="哈希值" prop="hashValue">
          <el-input v-model="form.hashValue" placeholder="请输入哈希值" />
        </el-form-item>
        <el-form-item label="下注金额" prop="betAmount">
          <el-input v-model="form.betAmount" placeholder="请输入下注金额" />
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
        <el-form-item label="下注结果" prop="betResult">
          <el-select v-model="form.betResult" placeholder="请选择下注结果">
            <el-option
              v-for="dict in dict.type.bet_result"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="游戏汇总" prop="gameCollect">
          <el-input v-model="form.gameCollect" placeholder="请输入游戏汇总" />
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
import { listHashSelect, getHashSelect, delHashSelect, addHashSelect, updateHashSelect } from "@/api/hash-game/hashSelect";
import UserInfoDialog from "../../components/dialog/UserInfoDialog.vue";
export default {
  name: "HashSelect",
  components: { UserInfoDialog },
  dicts: ['wallet_type', 'bet_result'],
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
      // 哈希查询记录表格数据
      hashSelectList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        nickName: null,
        invitationCode: null,
        orderId: null,
        hashValue: null,
        betAmount: null,
        walletType: null,
        betResult: null,
        createTime: null,
        gameCollect: null,
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
    this.getList();
  },
  methods: {
    openUserDetail(userId) {
      this.openUser = true;
      this.userId = userId;
    },
    sortChange(val) {
      //console.log(val)
      if (val.order && val.order == 'descending') {
        this.queryParams.isAsc = 'desc'
      } else {
        this.queryParams.isAsc = 'asc'
      }
      this.queryParams.orderByColumn = val.prop && val.prop
      //console.log(this.queryParams)
      this.getList()
    },
    /** 查询哈希查询记录列表 */
    getList() {
      this.loading = true;
      listHashSelect(this.queryParams).then(response => {
        this.hashSelectList = response.rows;
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
        invitationCode: null,
        orderId: null,
        hashValue: null,
        betAmount: null,
        walletType: null,
        betResult: null,
        gameCollect: null,
        createTime: null,
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
      this.title = "添加哈希查询记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getHashSelect(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改哈希查询记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateHashSelect(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addHashSelect(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除哈希查询记录编号为"' + ids + '"的数据项？').then(function () {
        return delHashSelect(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('hash-game/hashSelect/export', {
        ...this.queryParams
      }, `hashSelect_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
<style scoped>
::v-deep .el-input__inner {
  width: 160px;
}

::v-deep .pagination-container .el-pagination{
  right: 100px;
}
</style>
