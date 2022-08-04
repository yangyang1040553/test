<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
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
      <el-form-item label="日期">
        <el-date-picker
          v-model="queryParams.id"
          style="width: 240px"
          placeholder="请选择时间"
          value-format="yyyy-MM-dd"
          type="date"
        ></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5"> -->
      <!-- <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['hash-statistical:win:add']"
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
          v-hasPermi="['hash-statistical:win:edit']"
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
          v-hasPermi="['hash-statistical:win:remove']"
        >删除</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hash-statistical:win:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="winList"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
      height="600"
    >
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="日期" align="center" prop="id" width="180" sortable>
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.id, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户ID" align="center" prop="userId">
        <template slot-scope="scope">
          <div
            class="global-text-blue"
            @click="openUserDetail(scope.row.userId)"
          >{{scope.row.userId}}</div>
        </template>
      </el-table-column>
      <el-table-column label="用户昵称" align="center" prop="nick_name">
        <template slot-scope="scope">
          <div>{{scope.row.note_name?scope.row.note_name:scope.row.nick_name}}</div>
        </template>
      </el-table-column>
      <el-table-column label="邀请码" align="center" prop="invitation_code" />
      <el-table-column label="USDT押注金额" align="center" prop="usdtBetAmount" />
      <el-table-column label="USDT中奖金额" align="center" prop="usdtAwardAmount" />
      <el-table-column label="USDT输赢金额" align="center" prop="usdtWinAmount" sortable>
        <template slot-scope="scope">
          <span
            :class="scope.row.usdtWinAmount>0?'global-text-green':'global-text-red'"
          >{{ scope.row.usdtWinAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="TRX押注金额" align="center" prop="trxBetAmount" />
      <el-table-column label="TRX中奖金额" align="center" prop="trxAwardAmount" />
      <el-table-column label="TRX输赢金额" align="center" prop="trxWinAmount" sortable>
        <template slot-scope="scope">
          <span
            :class="scope.row.trxWinAmount>0?'global-text-green':'global-text-red'"
          >{{ scope.row.trxWinAmount }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['hash-statistical:win:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['hash-statistical:win:remove']"
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

    <!-- 添加或修改玩家输赢对话框 -->
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
        <el-form-item label="今日usdt押注金额" prop="usdtBetAmount">
          <el-input v-model="form.usdtBetAmount" placeholder="请输入今日usdt押注金额" />
        </el-form-item>
        <el-form-item label="今日usdt中奖金额" prop="usdtAwardAmount">
          <el-input v-model="form.usdtAwardAmount" placeholder="请输入今日usdt中奖金额" />
        </el-form-item>
        <el-form-item label="今日usdt输赢金额" prop="usdtWinAmount">
          <el-input v-model="form.usdtWinAmount" placeholder="请输入今日usdt输赢金额" />
        </el-form-item>
        <el-form-item label="今日trx押注金额" prop="trxBetAmount">
          <el-input v-model="form.trxBetAmount" placeholder="请输入今日trx押注金额" />
        </el-form-item>
        <el-form-item label="今日trx中奖金额" prop="trxAwardAmount">
          <el-input v-model="form.trxAwardAmount" placeholder="请输入今日trx中奖金额" />
        </el-form-item>
        <el-form-item label="今日trx输赢金额" prop="trxWinAmount">
          <el-input v-model="form.trxWinAmount" placeholder="请输入今日trx输赢金额" />
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
import { listWin, getWin, delWin, addWin, updateWin } from "@/api/hash-statistical/win";
import UserInfoDialog from "../../components/dialog/UserInfoDialog.vue";
export default {
  name: "Win",
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
      // 玩家输赢表格数据
      winList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 今日trx输赢金额时间范围
      daterangeId: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: null,
        userId: null,
        usdtBetAmount: null,
        usdtAwardAmount: null,
        usdtWinAmount: null,
        trxBetAmount: null,
        trxAwardAmount: null,
        trxWinAmount: null,
        invitation_code: null,
        orderByColumn: 'id',
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
    /** 查询玩家输赢列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeId && '' != this.daterangeId) {
        this.queryParams.params["beginId"] = this.daterangeId[0];
        this.queryParams.params["endId"] = this.daterangeId[1];
      }
      listWin(this.queryParams).then(response => {
        this.winList = response.rows;
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
        usdtBetAmount: null,
        usdtAwardAmount: null,
        usdtWinAmount: null,
        trxBetAmount: null,
        trxAwardAmount: null,
        trxWinAmount: null,
        invitation_code: null,
        orderByColumn: 'id',
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
      this.daterangeId = [];
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
      this.title = "添加玩家输赢";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getWin(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改玩家输赢";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateWin(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addWin(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除玩家输赢编号为"' + ids + '"的数据项？').then(function () {
        return delWin(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('hash-statistical/win/export', {
        ...this.queryParams
      }, `win_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
