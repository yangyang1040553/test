<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
    >
      <!-- <el-form-item label="游戏ID" prop="gameId">
        <el-input
          v-model="queryParams.gameId"
          placeholder="请输入游戏ID"
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
      <el-form-item label="玩家ID" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入玩家ID"
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
      <el-form-item label="账单ID" prop="id">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入账单ID"
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
      <!-- <el-form-item label="赔率" prop="odds">
        <el-input
          v-model="queryParams.odds"
          placeholder="请输入赔率"
          clearable
          oninput="value=value.replace(/[^\d\.]/g,'')"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <el-form-item label="投注类型" prop="betWalletType">
        <el-select v-model="queryParams.betWalletType" placeholder="请选择投注的钱包类型" clearable>
          <el-option
            v-for="dict in dict.type.wallet_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="投注金额" prop="betAmount">
        <el-input
          v-model="queryParams.betAmount"
          placeholder="请输入投注金额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <!-- <el-form-item label="手续费" prop="taxAmount">
        <el-input
          v-model="queryParams.taxAmount"
          placeholder="请输入手续费"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <!-- <el-form-item label="hash值" prop="hashValue">
        <el-input
          v-model="queryParams.hashValue"
          placeholder="请输入hash值"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <el-form-item label="下注结果" prop="betResult">
        <el-select v-model="queryParams.betResult" placeholder="请选择下注结果" clearable>
          <el-option
            v-for="dict in dict.type.bet_result"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="到账结果" prop="rewardStatus">
        <el-select v-model="queryParams.rewardStatus" placeholder="请选择到账结果" clearable>
          <el-option
            v-for="dict in dict.type.reward_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="赢家" prop="winner">
        <el-select v-model="queryParams.winner" placeholder="请选择赢家" clearable>
          <el-option
            v-for="dict in dict.type.winner"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="奖金回调" prop="awardCallback">
        <el-select v-model="queryParams.awardCallback" placeholder="请选择回调状态" clearable>
          <el-option
            v-for="dict in dict.type.award_callback"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="投注时间" prop="createTime">
        <el-date-picker
          clearable
          v-model="queryParams.createTime"
          type="date"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="请选择投注时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['hash-game:record:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['hash-game:record:edit']">修改</el-button>
      </el-col>-->
      <!-- <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['hash-game:record:remove']">
          删除
        </el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hash-game:record:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="recordList"
      @sort-change="sortChange"
      height="600"
      :default-sort="{ prop: 'create_time', order: 'descending' }"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="账单ID" align="center" prop="id" width="200" />
      <!-- <el-table-column label="配置ID" align="center" prop="configId" /> -->
      <el-table-column label="游戏" align="center" prop="gameId">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.game_list" :value="scope.row.gameId" />
        </template>
      </el-table-column>
      <!-- <el-table-column label="场次id" align="center" prop="sessionId" /> -->
      <!-- <el-table-column label="玩家ID" align="center" prop="userId" width="200" /> -->
      <el-table-column label="玩家ID" align="center" prop="userId" width="200">
        <template slot-scope="scope">
          <div
            class="global-text-blue"
            @click="openUserDetail(scope.row.userId)"
          >{{scope.row.userId}}</div>
        </template>
      </el-table-column>
      <el-table-column label="玩家昵称" align="center" prop="nickName" />
      <el-table-column label="邀请码" align="center" prop="invitation_code" />
      <el-table-column label="赔率" align="center" prop="odds" />
      <el-table-column label="投注类型" align="center" prop="betWalletType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.wallet_type" :value="scope.row.betWalletType" />
        </template>
      </el-table-column>
      <el-table-column label="投注金额" align="center" prop="betAmount" width="200">
        <template slot-scope="scope">
          <div>{{ scope.row.betAmount.toFixed(2) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="投注位置" align="center" prop="betPosition">
        <template slot-scope="scope">
          <div>{{ scope.row.betPosition||"-" }}</div>
        </template>
      </el-table-column>
      <!-- <el-table-column label="金额状态" align="center" prop="awardAmount">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.bet_money_status" :value="scope.row.betResult" />
        </template>
      </el-table-column>-->
      <el-table-column label="中奖金额 | 退回金额" align="center" prop="awardAmount" width="120">
        <template slot-scope="scope">
          <div>{{ scope.row.awardAmount.toFixed(2) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="入账金额" align="center" prop="incomeAmount" width="120">
        <template slot-scope="scope">
          <div>{{ scope.row.incomeAmount.toFixed(2) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="输赢金额" align="center" prop="winAmount" width="120">
        <template slot-scope="scope">
          <div>{{ scope.row.winAmount.toFixed(2) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="手续费" align="center" prop="taxAmount" width="120">
        <template slot-scope="scope">
          <div>{{ scope.row.taxAmount.toFixed(2) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="奖金回调" align="center" prop="awardCallback">
        <template slot-scope="scope">
          <div
            v-if="scope.row.awardAmount>0"
            :class="scope.row.awardCallback !=1? 'global-text-red':''"
          >{{ scope.row.awardCallback==1?'已回调':'未回调' }}</div>
          <div v-else>-</div>
        </template>
      </el-table-column>
      <el-table-column label="说明" align="center" prop="note">
        <template slot-scope="scope">
          <div>{{ scope.row.note || '-' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="hash值" align="center" prop="hashValue" width="300" />
      <el-table-column label="下注时间" align="center" prop="createTime" sortable width="180" />
      <el-table-column label="开奖时间" align="center" prop="finishTime" sortable width="180" />
      <el-table-column label="下注结果" align="center" prop="betResult">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.bet_result" :value="scope.row.betResult" />
        </template>
      </el-table-column>
      <el-table-column label="到账结果" align="center" prop="rewardStatus" width="120">
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
      <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['hash-game:record:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['hash-game:record:remove']">删除</el-button>
        </template>
      </el-table-column>-->
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改游戏投注记录对话框 -->
    <!-- <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="游戏配置ID" prop="configId">
          <el-input v-model="form.configId" placeholder="请输入游戏配置ID" />
        </el-form-item>
        <el-form-item label="游戏ID" prop="gameId">
          <el-input v-model="form.gameId" placeholder="请输入游戏ID" />
        </el-form-item>
        <el-form-item label="场次id" prop="sessionId">
          <el-input v-model="form.sessionId" placeholder="请输入场次id" />
        </el-form-item>
        <el-form-item label="玩家ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入玩家ID" />
        </el-form-item>
        <el-form-item label="玩家昵称" prop="nickName">
          <el-input v-model="form.nickName" placeholder="请输入玩家昵称" />
        </el-form-item>
        <el-form-item label="赔率" prop="odds">
          <el-input v-model="form.odds" placeholder="请输入赔率" />
        </el-form-item>
        <el-form-item label="投注类型" prop="betWalletType">
          <el-select v-model="form.betWalletType" placeholder="请选择投注的钱包类型">
            <el-option
              v-for="dict in dict.type.wallet_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
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
            <el-option
              v-for="dict in dict.type.bet_result"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="到账结果" prop="rewardStatus">
          <el-select v-model="form.rewardStatus" placeholder="请选择到账结果">
            <el-option
              v-for="dict in dict.type.reward_status"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="赢家" prop="winner">
          <el-select v-model="form.winner" placeholder="请选择赢家">
            <el-option
              v-for="dict in dict.type.winner"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
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
    </el-dialog>-->
    <UserInfoDialog v-if="openUser" :open="openUser" :id="userId" @close="openUser=false" />
  </div>
</template>

<script>
import merge from 'webpack-merge'
import { listRecord, getRecord, delRecord, addRecord, updateRecord } from '@/api/hash-game/record'
import UserInfoDialog from "../../components/dialog/UserInfoDialog.vue";
export default {
  name: 'Record',
  dicts: ['winner', 'wallet_type', 'bet_money_status', , 'money_status', 'reward_status', 'bet_result', 'game_list', 'award_callback'],
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
      // 游戏投注记录表格数据
      recordList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        id: null,
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
        awardCallback: null,
        invitation_code: null,
        // sort: 'desc',
        // prop: 'create_time',
        orderByColumn: 'createTime',
        isAsc: 'desc'
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {}
    }
  },
  created() {
    if (this.$route.query.orderId) {
      this.queryParams.id = this.$route.query.orderId
    }
    if (this.$route.query.userId) {
      this.queryParams.userId = this.$route.query.userId
    }
    this.getList()
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
        invitation_code: null,
        createTime: null,
        orderByColumn: 'createTime',
        isAsc: 'desc'
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
      this.$router.push({ query: merge({}, {}) })
      this.resetForm('queryForm')
      this.queryParams.id = null
      this.queryParams.userId = null
      // console.log(this.queryParams)
      this.handleQuery(this.queryParams)
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
      let obj = { ...this.queryParams }
      obj.pageSize = 5000
      this.download(
        'hash-game/record/export',
        {
          ...obj
        },
        `record_${new Date().getTime()}.xlsx`
      )
    }
  }
}
</script>
