<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="玩家ID" prop="id">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入玩家ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="玩家邀请码" prop="invitationCode">
        <el-input
          v-model="queryParams.invitationCode"
          placeholder="请输入玩家的邀请码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="上级玩家ID" prop="fatherUserId">
        <el-input
          v-model="queryParams.fatherUserId"
          placeholder="请输入上级玩家ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="上级邀请码" prop="fatherInvitationCode">
        <el-input
          v-model="queryParams.fatherInvitationCode"
          placeholder="请输入上级玩家的邀请码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          clearable
          v-model="queryParams.createTime"
          type="date"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="请选择创建时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5"><el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['hash-game:promote:add']">新增</el-button></el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['hash-game:promote:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['hash-game:promote:remove']">删除</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hash-game:promote:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      @sort-change="sortChange"
      :data="promoteList"
      @selection-change="handleSelectionChange"
      height="600"
      border
    >
      <!-- <el-table-column label="玩家ID" align="center" prop="id" width="200" /> -->
      <el-table-column label="玩家ID" align="center" prop="id" width="200">
        <template slot-scope="scope">
          <div class="global-text-blue" @click="openUserDetail(scope.row.id)">{{scope.row.id}}</div>
        </template>
      </el-table-column>
      <el-table-column label="玩家邀请码" align="center" prop="invitationCode" width="100" />
      <!-- <el-table-column label="上级玩家ID" align="center" prop="fatherUserId" width="200" /> -->
      <el-table-column label="上级玩家ID" align="center" prop="fatherUserId" width="200">
        <template slot-scope="scope">
          <div
            v-if="scope.row.fatherUserId"
            class="global-text-blue"
            @click="openUserDetail(scope.row.fatherUserId)"
          >{{scope.row.fatherUserId}}</div>
          <div v-else>-</div>
        </template>
      </el-table-column>
      <el-table-column label="上级邀请码" align="center" prop="fatherInvitationCode" width="100">
        <template slot-scope="scope">
          <div>{{scope.row.fatherInvitationCode||"-"}}</div>
        </template>
      </el-table-column>
      <el-table-column label="USDT总收益" align="center" prop="incomeUsdtAmount" width="150" sortable>
        <template slot-scope="scope">
          <div>{{ scope.row.incomeUsdtAmount? scope.row.incomeUsdtAmount.toFixed(2):"-" }}</div>
        </template>
      </el-table-column>
      <el-table-column label="USDT今日收益" align="center" prop="incomeUsdtToday" width="150" sortable>
        <template slot-scope="scope">
          <div>{{ scope.row.incomeUsdtToday? scope.row.incomeUsdtToday.toFixed(2):"-" }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="USDT昨日收益"
        align="center"
        prop="incomeUsdtYesterday"
        width="200"
        sortable
      >
        <template slot-scope="scope">
          <div>{{ scope.row.incomeUsdtYesterday?scope.row.incomeUsdtYesterday.toFixed(2):"-" }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="USDT直推收益"
        align="center"
        prop="incomeUsdtDirectPromote"
        width="150"
        sortable
      >
        <template slot-scope="scope">
          <div>{{ scope.row.incomeUsdtDirectPromote?scope.row.incomeUsdtDirectPromote.toFixed(2) :"-"}}</div>
        </template>
      </el-table-column>
      <el-table-column label="TRX总收益" align="center" prop="incomeTrxAmount" width="150" sortable>
        <template slot-scope="scope">
          <div>{{ scope.row.incomeTrxAmount?scope.row.incomeTrxAmount.toFixed(2):"-" }}</div>
        </template>
      </el-table-column>
      <el-table-column label="TRX今日收益" align="center" prop="incomeTrxToday" width="150" sortable>
        <template slot-scope="scope">
          <div>{{ scope.row.incomeTrxToday?scope.row.incomeTrxToday.toFixed(2):"-" }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="TRX昨日收益"
        align="center"
        prop="incomeTrxYesterday"
        width="150"
        sortable
      >
        <template slot-scope="scope">
          <div>{{ scope.row.incomeTrxYesterday?scope.row.incomeTrxYesterday.toFixed(2):"-" }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="TRX直推收益"
        align="center"
        prop="incomeTrxDirectPromote"
        width="150"
        sortable
      >
        <template slot-scope="scope">
          <div>{{scope.row.incomeTrxDirectPromote? scope.row.incomeTrxDirectPromote.toFixed(2):"-" }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="可提现USDT"
        align="center"
        prop="canWithdrawUsdtAmount"
        width="150"
        sortable
      >
        <template slot-scope="scope">
          <div>{{scope.row.canWithdrawUsdtAmount? scope.row.canWithdrawUsdtAmount.toFixed(2):"-" }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="可提现TRX"
        align="center"
        prop="canWithdrawTrxAmount"
        width="150"
        sortable
      >
        <template slot-scope="scope">
          <div>{{ scope.row.canWithdrawTrxAmount? scope.row.canWithdrawTrxAmount.toFixed(2):"-" }}</div>
        </template>
      </el-table-column>
      <el-table-column label="一级代理" align="center" prop="level1Person" width="100" sortable>
        <template slot-scope="scope">
          <div>{{ scope.row.level1Person? scope.row.level1Person:"-" }}</div>
        </template>
      </el-table-column>
      <el-table-column label="二级代理" align="center" prop="level2Person" width="100" sortable>
        <template slot-scope="scope">
          <div>{{ scope.row.level2Person? scope.row.level2Person:"-" }}</div>
        </template>
      </el-table-column>
      <el-table-column label="三级代理" align="center" prop="level3Person" width="100" sortable>
        <template slot-scope="scope">
          <div>{{ scope.row.level3Person? scope.row.level3Person:"-" }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="邀请奖励人数"
        align="center"
        prop="invite_award_person"
        width="100"
        sortable
      >
        <template slot-scope="scope">
          <div>{{scope.row.invite_award_person>0? scope.row.invite_award_person:"-" }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="团队USDT总输赢"
        align="center"
        prop="team_usdt_win_amount"
        width="100"
        sortable
      >
        <template slot-scope="scope">
          <span
            :class="scope.row.team_usdt_win_amount>0?'global-text-green':'global-text-red'"
          >{{ scope.row.team_usdt_win_amount? scope.row.team_usdt_win_amount.toFixed(2):"-"}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="团队TRX总输赢"
        align="center"
        prop="team_trx_win_amount"
        width="100"
        sortable
      >
        <template slot-scope="scope">
          <span
            :class="scope.row.team_trx_win_amount>0?'global-text-green':'global-text-red'"
          >{{ scope.row.team_trx_win_amount?scope.row.team_trx_win_amount.toFixed(2):"-" }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="USDT游戏返佣"
        align="center"
        prop="usdtGameBrokerageToFather"
        width="150"
        sortable
      >
        <template slot-scope="scope">
          <div>{{scope.row.usdtGameBrokerageToFather? scope.row.usdtGameBrokerageToFather.toFixed(2):"-" }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="USDT代理返佣"
        align="center"
        prop="usdtPromoteBrokerageToFather"
        width="150"
        sortable
      >
        <template slot-scope="scope">
          <div>{{scope.row.usdtPromoteBrokerageToFather? scope.row.usdtPromoteBrokerageToFather.toFixed(2) :"-"}}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="TRX游戏返佣"
        align="center"
        prop="trxGameBrokerageToFather"
        width="150"
        sortable
      >
        <template slot-scope="scope">
          <div>{{ scope.row.trxGameBrokerageToFather?scope.row.trxGameBrokerageToFather.toFixed(2):"-" }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="TRX代理返佣"
        align="center"
        prop="trxPromoteBrokerageToFather"
        width="150"
        sortable
      >
        <template slot-scope="scope">
          <div>{{scope.row.trxPromoteBrokerageToFather? scope.row.trxPromoteBrokerageToFather.toFixed(2):"-" }}</div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" prop="updateTime" width="180" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime || '-' }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['hash-game:promote:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['hash-game:promote:remove']">删除</el-button>
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

    <!-- 添加或修改推广记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="玩家的邀请码" prop="invitationCode">
          <el-input v-model="form.invitationCode" placeholder="请输入玩家的邀请码" />
        </el-form-item>
        <el-form-item label="上级玩家ID" prop="fatherUserId">
          <el-input v-model="form.fatherUserId" placeholder="请输入上级玩家ID" />
        </el-form-item>
        <el-form-item label="上级玩家的邀请码" prop="fatherInvitationCode">
          <el-input v-model="form.fatherInvitationCode" placeholder="请输入上级玩家的邀请码" />
        </el-form-item>
        <el-form-item label="usdt总收益" prop="incomeUsdtAmount">
          <el-input v-model="form.incomeUsdtAmount" placeholder="请输入usdt总收益" />
        </el-form-item>
        <el-form-item label="usdt今日收益" prop="incomeUsdtToday">
          <el-input v-model="form.incomeUsdtToday" placeholder="请输入usdt今日收益" />
        </el-form-item>
        <el-form-item label="usdt昨日收益" prop="incomeUsdtYesterday">
          <el-input v-model="form.incomeUsdtYesterday" placeholder="请输入usdt昨日收益" />
        </el-form-item>
        <el-form-item label="usdt直推收益" prop="incomeUsdtDirectPromote">
          <el-input v-model="form.incomeUsdtDirectPromote" placeholder="请输入usdt直推收益" />
        </el-form-item>
        <el-form-item label="trx总收益" prop="incomeTrxAmount">
          <el-input v-model="form.incomeTrxAmount" placeholder="请输入trx总收益" />
        </el-form-item>
        <el-form-item label="trx今日收益" prop="incomeTrxToday">
          <el-input v-model="form.incomeTrxToday" placeholder="请输入trx今日收益" />
        </el-form-item>
        <el-form-item label="trx昨日收益" prop="incomeTrxYesterday">
          <el-input v-model="form.incomeTrxYesterday" placeholder="请输入trx昨日收益" />
        </el-form-item>
        <el-form-item label="trx直推收益" prop="incomeTrxDirectPromote">
          <el-input v-model="form.incomeTrxDirectPromote" placeholder="请输入trx直推收益" />
        </el-form-item>
        <el-form-item label="可提现的usdt金额" prop="canWithdrawUsdtAmount">
          <el-input v-model="form.canWithdrawUsdtAmount" placeholder="请输入可提现的usdt金额" />
        </el-form-item>
        <el-form-item label="可提现的trx金额" prop="canWithdrawTrxAmount">
          <el-input v-model="form.canWithdrawTrxAmount" placeholder="请输入可提现的trx金额" />
        </el-form-item>
        <el-form-item label="一级代理人数" prop="level1Person">
          <el-input v-model="form.level1Person" placeholder="请输入一级代理人数" />
        </el-form-item>
        <el-form-item label="二级代理人数" prop="level2Person">
          <el-input v-model="form.level2Person" placeholder="请输入二级代理人数" />
        </el-form-item>
        <el-form-item label="三级代理人数" prop="level3Person">
          <el-input v-model="form.level3Person" placeholder="请输入三级代理人数" />
        </el-form-item>
        <el-form-item label="usdt游戏返佣" prop="usdtGameBrokerageToFather">
          <el-input v-model="form.usdtGameBrokerageToFather" placeholder="请输入usdt对直接上级的游戏返佣贡献" />
        </el-form-item>
        <el-form-item label="usdt对直接上级的代理返佣贡献" prop="usdtPromoteBrokerageToFather">
          <el-input v-model="form.usdtPromoteBrokerageToFather" placeholder="请输入usdt对直接上级的代理返佣贡献" />
        </el-form-item>
        <el-form-item label="trx对直接上级的游戏返佣贡献" prop="trxGameBrokerageToFather">
          <el-input v-model="form.trxGameBrokerageToFather" placeholder="请输入trx对直接上级的游戏返佣贡献" />
        </el-form-item>
        <el-form-item label="trx对直接上级的代理返佣贡献" prop="trxPromoteBrokerageToFather">
          <el-input v-model="form.trxPromoteBrokerageToFather" placeholder="请输入trx对直接上级的代理返佣贡献" />
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
import { listPromote, getPromote, delPromote, addPromote, updatePromote } from '@/api/hash-game/promote'
import UserInfoDialog from "../../components/dialog/UserInfoDialog.vue";
import merge from 'webpack-merge'
export default {
  name: 'Promote',
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
      // 推广记录表格数据
      promoteList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        invitationCode: null,
        fatherUserId: null,
        fatherInvitationCode: null,
        createTime: null,
        orderByColumn: 'createTime',
        isAsc: 'desc',
        id: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {}
    }
  },
  created() {
    if (this.$route.query.parentId) {
      this.queryParams.fatherUserId = this.$route.query.parentId
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
    /** 查询推广记录列表 */
    getList() {
      this.loading = true
      listPromote(this.queryParams).then(response => {
        this.promoteList = response.rows
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
        invitationCode: null,
        fatherUserId: null,
        fatherInvitationCode: null,
        incomeUsdtAmount: null,
        incomeUsdtToday: null,
        incomeUsdtYesterday: null,
        incomeUsdtDirectPromote: null,
        incomeTrxAmount: null,
        incomeTrxToday: null,
        incomeTrxYesterday: null,
        incomeTrxDirectPromote: null,
        canWithdrawUsdtAmount: null,
        canWithdrawTrxAmount: null,
        level1Person: null,
        level2Person: null,
        level3Person: null,
        createTime: null,
        updateTime: null,
        usdtGameBrokerageToFather: null,
        usdtPromoteBrokerageToFather: null,
        trxGameBrokerageToFather: null,
        trxPromoteBrokerageToFather: null,
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
      this.queryParams.fatherUserId = ''
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
      this.title = '添加推广记录'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getPromote(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改推广记录'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updatePromote(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addPromote(this.form).then(response => {
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
        .confirm('是否确认删除推广记录编号为"' + ids + '"的数据项？')
        .then(function () {
          return delPromote(ids)
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
        'hash-game/promote/export',
        {
          ...this.queryParams
        },
        `promote_${new Date().getTime()}.xlsx`
      )
    }
  }
}
</script>
