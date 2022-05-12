<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="游戏id" prop="gameId">
        <el-input v-model="queryParams.gameId" placeholder="请输入游戏id" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="玩家id" prop="userId">
        <el-input v-model="queryParams.userId" placeholder="请输入玩家id" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="玩家昵称" prop="nickName">
        <el-input v-model="queryParams.nickName" placeholder="请输入玩家昵称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="赔率" prop="odds">
        <el-input v-model="queryParams.odds" placeholder="请输入赔率" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="投注类型" prop="betWalletType">
        <el-select v-model="queryParams.betWalletType" placeholder="请选择投注的钱包类型" clearable>
          <el-option v-for="dict in dict.type.wallet_type" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="投注金额" prop="betAmount">
        <el-input v-model="queryParams.betAmount" placeholder="请输入投注金额" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="手续费" prop="taxAmount">
        <el-input v-model="queryParams.taxAmount" placeholder="请输入手续费" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="hash值" prop="hashValue">
        <el-input v-model="queryParams.hashValue" placeholder="请输入hash值" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="下注结果" prop="betResult">
        <el-select v-model="queryParams.betResult" placeholder="请选择下注结果" clearable>
          <el-option v-for="dict in dict.type.bet_result" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="到账结果" prop="rewardStatus">
        <el-select v-model="queryParams.rewardStatus" placeholder="请选择到账结果" clearable>
          <el-option v-for="dict in dict.type.reward_status" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="赢家" prop="winner">
        <el-select v-model="queryParams.winner" placeholder="请选择赢家" clearable>
          <el-option v-for="dict in dict.type.winner" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker clearable v-model="queryParams.createTime" type="date" value-format="yyyy-MM-dd"
          placeholder="请选择创建时间"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['hash-game:record:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['hash-game:record:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['hash-game:record:remove']">
          删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['hash-game:record:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="recordList" @sort-change="sortChange"  :default-sort="{ prop: 'create_time', order: 'descending' }"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="唯一id" align="center" prop="id" />
      <el-table-column label="配置id" align="center" prop="configId" />
      <el-table-column label="游戏id" align="center" prop="gameId" />
      <el-table-column label="场次id" align="center" prop="sessionId" />
      <el-table-column label="玩家id" align="center" prop="userId" />
      <el-table-column label="玩家昵称" align="center" prop="nickName" />
      <el-table-column label="赔率" align="center" prop="odds" />
      <el-table-column label="投注类型" align="center" prop="betWalletType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.wallet_type" :value="scope.row.betWalletType" />
        </template>
      </el-table-column>
      <el-table-column label="投注金额" align="center" prop="betAmount" />
      <el-table-column label="投注位置" align="center" prop="betPosition" />
      <el-table-column label="金额状态" align="center" prop="awardAmount">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.money_status" :value="scope.row.awardAmount" />
        </template>
      </el-table-column>
      <el-table-column label="手续费" align="center" prop="taxAmount" />
      <el-table-column label="hash值" align="center" prop="hashValue" />
      <el-table-column label="下注时间" align="center" prop="createTime" sortable width="120" />
      <el-table-column label="下注结果" align="center" prop="betResult">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.bet_result" :value="scope.row.betResult" />
        </template>
      </el-table-column>
      <el-table-column label="到账结果" align="center" prop="rewardStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.reward_status" :value="scope.row.rewardStatus" />
        </template>
      </el-table-column>
      <el-table-column label="赢家" align="center" prop="winner">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.winner" :value="scope.row.winner" />
        </template>
      </el-table-column>
      <el-table-column label="游戏汇总" align="center" prop="gameCollect" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['hash-game:record:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['hash-game:record:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改游戏投注记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="游戏配置id" prop="configId">
          <el-input v-model="form.configId" placeholder="请输入游戏配置id" />
        </el-form-item>
        <el-form-item label="游戏id" prop="gameId">
          <el-input v-model="form.gameId" placeholder="请输入游戏id" />
        </el-form-item>
        <el-form-item label="场次id" prop="sessionId">
          <el-input v-model="form.sessionId" placeholder="请输入场次id" />
        </el-form-item>
        <el-form-item label="玩家id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入玩家id" />
        </el-form-item>
        <el-form-item label="玩家昵称" prop="nickName">
          <el-input v-model="form.nickName" placeholder="请输入玩家昵称" />
        </el-form-item>
        <el-form-item label="赔率" prop="odds">
          <el-input v-model="form.odds" placeholder="请输入赔率" />
        </el-form-item>
        <el-form-item label="投注类型" prop="betWalletType">
          <el-select v-model="form.betWalletType" placeholder="请选择投注的钱包类型">
            <el-option v-for="dict in dict.type.wallet_type" :key="dict.value" :label="dict.label" :value="dict.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="投注金额" prop="betAmount">
          <el-input v-model="form.betAmount" placeholder="请输入投注金额" />
        </el-form-item>
        <el-form-item label="投注位置" prop="betPosition">
          <el-input v-model="form.betPosition" placeholder="请输入投注位置" />
        </el-form-item>
        <el-form-item label="金额状态" prop="awardAmount">
          <el-select v-model="form.awardAmount" placeholder="请选择中奖金额或退回金额">
            <el-option v-for="dict in dict.type.money_status" :key="dict.value" :label="dict.label"
              :value="parseInt(dict.value)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手续费" prop="taxAmount">
          <el-input v-model="form.taxAmount" placeholder="请输入手续费" />
        </el-form-item>
        <el-form-item label="hash值" prop="hashValue">
          <el-input v-model="form.hashValue" placeholder="请输入hash值" />
        </el-form-item>
        <el-form-item label="下注结果" prop="betResult">
          <el-select v-model="form.betResult" placeholder="请选择下注结果">
            <el-option v-for="dict in dict.type.bet_result" :key="dict.value" :label="dict.label"
              :value="parseInt(dict.value)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="到账结果" prop="rewardStatus">
          <el-select v-model="form.rewardStatus" placeholder="请选择到账结果">
            <el-option v-for="dict in dict.type.reward_status" :key="dict.value" :label="dict.label"
              :value="parseInt(dict.value)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="赢家" prop="winner">
          <el-select v-model="form.winner" placeholder="请选择赢家">
            <el-option v-for="dict in dict.type.winner" :key="dict.value" :label="dict.label"
              :value="parseInt(dict.value)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="游戏汇总" prop="gameCollect">
          <el-input v-model="form.gameCollect" placeholder="请输入本局游戏汇总" />
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
import { listRecord, getRecord, delRecord, addRecord, updateRecord } from '@/api/hash-game/record'

export default {
  name: 'Record',
  dicts: ['winner', 'wallet_type', 'money_status', 'reward_status', 'bet_result'],
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
      // 游戏投注记录表格数据
      recordList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        gameId: null,
        userId: null,
        nickName: null,
        odds: null,
        betWalletType: null,
        betAmount: null,
        taxAmount: null,
        hashValue: null,
        betResult: null,
        rewardStatus: null,
        winner: null,
        createTime: null,
        sort: 'desc',
        prop: 'create_time'
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    sortChange(val) {
      console.log(val)
      if (val.order && val.order == 'descending') {
        this.queryParams.sort = 'desc'
      } else {
        this.queryParams.sort = 'asc'
      }
      if (val.prop && val.prop == '"createTime"') {
        this.queryParams.prop = 'create_time'
      } else {
        this.queryParams.prop = 'finish_time'
      }
      this.getList()
    },
    /** 查询游戏投注记录列表 */
    getList() {
      this.loading = true
      listRecord(this.queryParams).then(response => {
        this.recordList = response.rows
        this.total = response.total
        this.loading = false
      })
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
        configId: null,
        gameId: null,
        sessionId: null,
        userId: null,
        nickName: null,
        odds: null,
        betWalletType: null,
        betAmount: null,
        betPosition: null,
        awardAmount: null,
        taxAmount: null,
        hashValue: null,
        betResult: null,
        rewardStatus: null,
        winner: null,
        gameCollect: null,
        createTime: null
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加游戏投注记录'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getRecord(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改游戏投注记录'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateRecord(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addRecord(this.form).then(response => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids
      this.$modal
        .confirm('是否确认删除游戏投注记录编号为"' + ids + '"的数据项？')
        .then(function () {
          return delRecord(ids)
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess('删除成功')
        })
        .catch(() => { })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        'hash-game/record/export',
        {
          ...this.queryParams
        },
        `record_${new Date().getTime()}.xlsx`
      )
    }
  }
}
</script>
