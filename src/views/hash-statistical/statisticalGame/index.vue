<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="78px"
    >
      <!-- <el-form-item label="游戏ID" prop="gameId">
        <el-input
          v-model="queryParams.gameId"
          placeholder="请输入游戏名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
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
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hash-game:config:export']"
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
      :data="statisticalGameList"
      @selection-change="handleSelectionChange"
      height="600"
      @sort-change="sortChange"
      border
    >
      <el-table-column label="日期" align="center" prop="time" sortable />
      <!-- <el-table-column label="游戏ID" align="center" prop="gameId" /> -->
      <el-table-column label="游戏名称" align="center" prop="gameName">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.game_list" :value="scope.row.gameId" />
        </template>
      </el-table-column>
      <!-- <el-table-column label="usdt押注金额" align="center" prop="usdtBetAmount" />
      <el-table-column label="usdt中奖金额" align="center" prop="usdtAwardAmount" />
      <el-table-column label="trx押注金额" align="center" prop="trxBetAmount" />
      <el-table-column label="trx中奖金额" align="center" prop="trxAwardAmount" />-->

      <el-table-column label="USDT押注金额" align="center" prop="usdtBetAmount" />
      <el-table-column label="USDT中奖金额" align="center" prop="usdtAwardAmount" />
      <el-table-column label="USDT输赢金额" align="center" prop="usdtWin" sortable>
        <template slot-scope="scope">
          <span
            :class="scope.row.usdtWin>0?'global-text-green':'global-text-red'"
          >{{ scope.row.usdtWin }}</span>
        </template>
      </el-table-column>
      <el-table-column label="TRX押注金额" align="center" prop="trxBetAmount" />
      <el-table-column label="TRX中奖金额" align="center" prop="trxAwardAmount" />
      <el-table-column label="TRX输赢金额" align="center" prop="trxWin" sortable>
        <template slot-scope="scope">
          <span
            :class="scope.row.trxWin>0?'global-text-green':'global-text-red'"
          >{{ scope.row.trxWin }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-zoom-in"
            @click="handleUpdate(scope.row, true)"
          >投注位置详情</el-button>
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

    <!-- 添加或修改游戏配置对话框 -->
    <el-dialog title :visible.sync="open" width="800px" append-to-body>
      <el-table v-loading="loading" :data="childrenList" height="500px">
        <!-- <el-table-column label="游戏ID" align="center" prop="gameId" />
        <el-table-column label="游戏名称" align="center" prop="gameName">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.game_list" :value="scope.row.gameId" />
          </template>
        </el-table-column>-->
        <el-table-column label="投注位置" align="center" prop="betPosition">
          <template slot-scope="scope">
            <span>{{scope.row.betPosition||"-"}}</span>
          </template>
        </el-table-column>
        <el-table-column label="usdt押注金额" align="center" prop="usdtBetAmount" />
        <el-table-column label="usdt中奖金额" align="center" prop="usdtAwardAmount" />
        <el-table-column label="trx押注金额" align="center" prop="trxBetAmount" />
        <el-table-column label="trx中奖金额" align="center" prop="trxAwardAmount" />
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listStatisticalGame, listChildren } from "@/api/hash-statistical/statisticalGame";

import { listGameMenu } from '@/api/hash-game/gameMenu'
export default {
  name: 'Config',
  dicts: ['game_list'],
  data() {
    return {
      //是否查看详情
      isDetail: false,
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
      // 游戏配置表格数据
      statisticalGameList: [],
      childrenList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      //类型
      tabPosition: 1,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        gameId: null,
        orderByColumn: 'time',
        isAsc: 'desc',
        type: 1
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        menuId: [{ required: true, message: '请选择游戏菜单', trigger: 'blur' }],
        gameName: [{ required: true, message: '请输入游戏名称', trigger: 'blur' }],
        gameSession: [{ required: true, message: '请选择游戏场次', trigger: 'blur' }],
        odds: [{ required: true, message: '请输入游戏倍率', trigger: 'blur' }],
        tax: [{ required: true, message: '请输入游戏税收', trigger: 'blur' }],
        open: [{ required: true, message: '请选择是否开启', trigger: 'blur' }],
        isActivity: [{ required: true, message: '请选择活动场', trigger: 'blur' }],
        isBrokerage: [{ required: true, message: '请选择是否返佣', trigger: 'blur' }]
      },
      gameMenuList: []
    }
  },
  watch: {
    tabPosition(news, old) {
      //console.log(news, old)
      this.queryParams.type = news
      this.getList()
    }
  },
  created() {
    this.getList()
  },
  methods: {
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
    /** 查询游戏配置列表 */
    getList() {
      this.loading = true
      listStatisticalGame(this.queryParams).then(response => {
        this.statisticalGameList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        gameId: null,
        gameId: null,
        orderByColumn: 'createTime',
        isAsc: 'desc',
        type: 1
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row, isDetail) {
      this.isDetail = isDetail
      listChildren({ gameId: row.gameId, time: row.time, type: this.tabPosition, week: row.week }).then(res => {
        this.childrenList = res.rows
        this.open = true

      })

    },
    /** 导出按钮操作 */
    handleExport() {
      let obj = { ...this.queryParams }
      obj.pageSize = 5000
      this.download(
        'hash-statistical/statisticalGame/export',
        {
          ...obj
        },
        `config_${new Date().getTime()}.xlsx`
      )
    }
  }
}
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
