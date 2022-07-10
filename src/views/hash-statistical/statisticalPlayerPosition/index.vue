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
      <el-form-item label="用户id" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入用户id"
          clearable
              oninput="value=value.replace(/[^\d\.]/g,'')"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="选择游戏" prop="gameId">
        <el-select v-model="queryParams.gameId" placeholder="请选择游戏" clearable>
          <el-option
            v-for="dict in dict.type.game_list"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="游戏id" prop="gameId">
        <el-input
          v-model="queryParams.gameId"
          placeholder="请输入游戏id"
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
          v-hasPermi="['hash-statistical:statisticalPlayerPosition:add']"
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
          v-hasPermi="['hash-statistical:statisticalPlayerPosition:edit']"
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
          v-hasPermi="['hash-statistical:statisticalPlayerPosition:remove']"
        >删除</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hash-statistical:statisticalPlayerPosition:export']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-radio-group v-model="tabPosition">
          <el-radio-button label="1">日</el-radio-button>
          <el-radio-button label="2">周</el-radio-button>
          <el-radio-button label="3">月</el-radio-button>
        </el-radio-group>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="statisticalPlayerPositionList"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
      height="600"
    >
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="日期" align="center" prop="time" sortable />
      <el-table-column label="用户id" align="center" prop="userId">
        <template slot-scope="scope">
          <div
            class="global-text-blue"
            @click="openUserDetail(scope.row.userId)"
          >{{scope.row.userId}}</div>
        </template>
      </el-table-column>
      <el-table-column label="游戏id" align="center" prop="gameId" />
      <el-table-column label="游戏名称" align="center" prop="gameName">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.game_list" :value="scope.row.gameId" />
        </template>
      </el-table-column>
      <el-table-column label="押注位置" align="center" prop="betPosition" />
      <el-table-column label="usdt总押注金额" align="center" prop="usdtBetAmount" />
      <el-table-column label="usdt总中奖金额" align="center" prop="usdtAwardAmount" />
      <el-table-column label="usdt输赢金额" align="center" prop="usdtWin" sortable>
        <template slot-scope="scope">
          <span
            :class="scope.row.usdtWin>0?'global-text-green':'global-text-red'"
          >{{ scope.row.usdtWin }}</span>
        </template>
      </el-table-column>
      <el-table-column label="trx押注金额" align="center" prop="trxBetAmount" />
      <el-table-column label="trx中奖金额" align="center" prop="trxAwardAmount" />
      <el-table-column label="trx输赢金额" align="center" prop="trxWin" sortable>
        <template slot-scope="scope">
          <span
            :class="scope.row.trxWin>0?'global-text-green':'global-text-red'"
          >{{ scope.row.trxWin }}</span>
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

    <!-- 添加或修改游戏玩家押注位置日统计对话框 -->
    <!-- <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="id-天为单位" prop="id">
          <el-input v-model="form.id" placeholder="请输入id-天为单位" />
        </el-form-item>
        <el-form-item label="用户id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户id" />
        </el-form-item>
        <el-form-item label="游戏id" prop="gameId">
          <el-input v-model="form.gameId" placeholder="请输入游戏id" />
        </el-form-item>
        <el-form-item label="押注位置" prop="betPosition">
          <el-input v-model="form.betPosition" placeholder="请输入押注位置" />
        </el-form-item>
        <el-form-item label="今天usdt总押注金额" prop="usdtBetAmount">
          <el-input v-model="form.usdtBetAmount" placeholder="请输入今天usdt总押注金额" />
        </el-form-item>
        <el-form-item label="今天usdt总中奖金额" prop="usdtAwardAmount">
          <el-input v-model="form.usdtAwardAmount" placeholder="请输入今天usdt总中奖金额" />
        </el-form-item>
        <el-form-item label="今日trx押注金额" prop="trxBetAmount">
          <el-input v-model="form.trxBetAmount" placeholder="请输入今日trx押注金额" />
        </el-form-item>
        <el-form-item label="今日trx中奖金额" prop="trxAwardAmount">
          <el-input v-model="form.trxAwardAmount" placeholder="请输入今日trx中奖金额" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>-->

    <UserInfoDialog v-if="open" :open="open" :id="userId" @close="open=false" />
  </div>
</template>

<script>
import { listStatisticalPlayerPosition, getStatisticalPlayerPosition, delStatisticalPlayerPosition, addStatisticalPlayerPosition, updateStatisticalPlayerPosition } from "@/api/hash-statistical/statisticalPlayerPosition";
import UserInfoDialog from "../../components/dialog/UserInfoDialog.vue";
export default {
  name: "StatisticalPlayerPosition",
  dicts: ['game_list'],
  components: {
    UserInfoDialog
  },
  data() {
    return {
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
      //类型
      tabPosition: 1,
      // 游戏玩家押注位置日统计表格数据
      statisticalPlayerPositionList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        gameId: null,
        type: 1,
        orderByColumn: 'time',
        isAsc: 'desc',
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [
          { required: true, message: "id-天为单位不能为空", trigger: "blur" }
        ],
      }
    };
  },
  watch: {
    tabPosition(news, old) {
      console.log(news, old)
      this.queryParams.type = news
      this.getList()
    }
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
      this.open = true;
      this.userId = userId;
    },
    /** 查询游戏玩家押注位置日统计列表 */
    getList() {
      this.loading = true;
      listStatisticalPlayerPosition(this.queryParams).then(response => {
        this.statisticalPlayerPositionList = response.rows;
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
        gameId: null,
        betPosition: null,
        usdtBetAmount: null,
        usdtAwardAmount: null,
        trxBetAmount: null,
        trxAwardAmount: null,
        type: 1,
        orderByColumn: 'time',
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
      this.title = "添加游戏玩家押注位置日统计";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getStatisticalPlayerPosition(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改游戏玩家押注位置日统计";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateStatisticalPlayerPosition(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addStatisticalPlayerPosition(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除游戏玩家押注位置日统计编号为"' + ids + '"的数据项？').then(function () {
        return delStatisticalPlayerPosition(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('hash-statistical/statisticalPlayerPosition/export', {
        ...this.queryParams
      }, `statisticalPlayerPosition_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
<style lang="scss" scoped>
.my-input {
  width: 200px;
}

.label {
  margin-left: 10px;
  margin-right: 5px;
}

.div-rule {
  width: 100%;
  text-align: start;
}

::v-deep .el-radio-button__inner {
  padding: 8px 16px;
  margin-top: -2px;
}
</style>
