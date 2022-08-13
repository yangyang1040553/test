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
      <el-form-item label="创建时间" prop="id">
        <el-date-picker
          clearable
          v-model="queryParams.id"
          type="date"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="请选择创建时间"
        ></el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="今日usdt押注金额" prop="usdtBetAmount">
        <el-input
          v-model="queryParams.usdtBetAmount"
          placeholder="请输入今日usdt押注金额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="今日usdt中奖金额" prop="usdtAwardAmount">
        <el-input
          v-model="queryParams.usdtAwardAmount"
          placeholder="请输入今日usdt中奖金额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="今日usdt输赢金额" prop="usdtWinAmount">
        <el-input
          v-model="queryParams.usdtWinAmount"
          placeholder="请输入今日usdt输赢金额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="今日trx押注金额" prop="trxBetAmount">
        <el-input
          v-model="queryParams.trxBetAmount"
          placeholder="请输入今日trx押注金额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="今日trx中奖金额" prop="trxAwardAmount">
        <el-input
          v-model="queryParams.trxAwardAmount"
          placeholder="请输入今日trx中奖金额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="今日trx输赢金额" prop="trxWinAmount">
        <el-input
          v-model="queryParams.trxWinAmount"
          placeholder="请输入今日trx输赢金额"
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
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['hash-statistical:gameWin:add']"
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
          v-hasPermi="['hash-statistical:gameWin:edit']"
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
          v-hasPermi="['hash-statistical:gameWin:remove']"
        >删除</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hash-statistical:gameWin:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" height="580" :data="gameWinList" @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="时间" align="center" prop="id" />
      <el-table-column label="今日usdt押注金额" align="center" prop="usdtBetAmount" />
      <el-table-column label="今日usdt中奖金额" align="center" prop="usdtAwardAmount" />
      <el-table-column label="今日usdt输赢金额" align="center" prop="usdtWinAmount" />
      <el-table-column label="今日trx押注金额" align="center" prop="trxBetAmount" />
      <el-table-column label="今日trx中奖金额" align="center" prop="trxAwardAmount" />
      <el-table-column label="今日trx输赢金额" align="center" prop="trxWinAmount" />
      <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['hash-statistical:gameWin:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['hash-statistical:gameWin:remove']"
          >删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改游戏输赢对话框 -->
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
  </div>
</template>

<script>
import { listGameWin, getGameWin, delGameWin, addGameWin, updateGameWin } from "@/api/hash-statistical/gameWin";

export default {
  name: "GameWin",
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
      // 游戏输赢表格数据
      gameWinList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: null,
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
    /** 查询游戏输赢列表 */
    getList() {
      this.loading = true;
      listGameWin(this.queryParams).then(response => {
        this.gameWinList = response.rows;
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
        usdtBetAmount: null,
        usdtAwardAmount: null,
        usdtWinAmount: null,
        trxBetAmount: null,
        trxAwardAmount: null,
        trxWinAmount: null
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
      this.title = "添加游戏输赢";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getGameWin(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改游戏输赢";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateGameWin(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addGameWin(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除游戏输赢编号为"' + ids + '"的数据项？').then(function () {
        return delGameWin(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('hash-statistical/gameWin/export', {
        ...this.queryParams
      }, `gameWin_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
