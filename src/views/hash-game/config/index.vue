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
      <!--      <el-form-item label="游戏名称" prop="gameName">
        <el-input
          v-model="queryParams.gameName"
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

      <el-form-item label="游戏场次" prop="gameSession">
        <el-select v-model="queryParams.gameSession" placeholder="请选择游戏场次" clearable>
          <el-option
            v-for="dict in dict.type.game_session"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="倍率配置" prop="odds">
        <el-input
          v-model="queryParams.odds"
          placeholder="请输入倍率配置"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="权重" prop="weight">
        <el-input
          v-model="queryParams.weight"
          placeholder="请输入权重"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否开启" prop="open">
        <el-select v-model="queryParams.open" placeholder="请选择是否开启" clearable>
          <el-option
            v-for="dict in dict.type.game_open"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="活动场" prop="isActivity">
        <el-select v-model="queryParams.isActivity" placeholder="请选择是否活动场" clearable>
          <el-option
            v-for="dict in dict.type.is_activty"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="参与返佣" prop="isBrokerage">
        <el-select v-model="queryParams.isBrokerage" placeholder="请选择是否参与返佣" clearable>
          <el-option
            v-for="dict in dict.type.is_brokerage"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="结束时间" prop="finishTime">
        <el-date-picker clearable v-model="queryParams.finishTime" type="date" value-format="yyyy-MM-dd"
          placeholder="请选择结束时间">
        </el-date-picker>
      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['hash-game:config:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate(null, false)"
          v-hasPermi="['hash-game:config:edit']"
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
          v-hasPermi="['hash-game:config:remove']"
        >删除</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hash-game:config:export']"
        >导出</el-button>
      </el-col> -->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="configList"
      @selection-change="handleSelectionChange"
      height="600"
      @sort-change="sortChange"
      :row-class-name="tableRowClassName"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="配置id" align="center" prop="id" />
      <el-table-column label="游戏id" align="center" prop="gameId" />
      <el-table-column label="游戏名称" align="center" prop="gameName" />
      <el-table-column label="游戏场次" align="center" prop="gameSession">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.game_session" :value="scope.row.gameSession" />
        </template>
      </el-table-column>
      <!-- <el-table-column label="下注规则" align="center" prop="betRuleList" width="160">
        <template slot-scope="scope">
          <div v-for="(item, index) in scope.row.betRuleList" :key="index">
            <div class="div-rule">{{ item.name }}最小{{ item.betMinLimit }}</div>
            <div class="div-rule">{{ item.name }}最大{{ item.betMaxLimit }}</div>
          </div>
        </template>
      </el-table-column>-->
      <el-table-column label="倍率配置" align="center" prop="odds">
        <template slot-scope="scope">
          <span v-if="scope.row.odds">{{ scope.row.odds.toFixed(4) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="税收" align="center" prop="tax">
        <template slot-scope="scope">
          <span v-if="scope.row.tax">{{ scope.row.tax.toFixed(4) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="权重" align="center" prop="weight" sortable></el-table-column>
      <el-table-column label="是否开启" align="center" prop="open">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.game_open" :value="scope.row.open" />
        </template>
      </el-table-column>
      <el-table-column label="是否活动场" align="center" prop="isActivity">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.is_activty" :value="scope.row.isActivity" />
        </template>
      </el-table-column>
      <el-table-column label="活动场描述" align="center" prop="activityDesc">
        <template slot-scope="scope">
          <div>{{scope.row.activityDesc}}</div>
        </template>
      </el-table-column>
      <el-table-column label="是否返佣" align="center" prop="isBrokerage">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.is_brokerage" :value="scope.row.isBrokerage" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" sortable width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" prop="updateTime" sortable width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-zoom-in"
            @click="handleUpdate(scope.row, true)"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row, false)"
            v-hasPermi="['hash-game:config:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['hash-game:config:remove']"
          >删除</el-button>
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
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" :disabled="isDetail">
        <el-form-item label="游戏菜单" prop="gameId">
          <el-select v-model="form.gameId" placeholder="请选择对应游戏">
            <!-- dict.activity   隐藏 特殊活动场 -->
            <el-option
              v-show="dict.activity != 1"
              v-for="dict in gameMenuList"
              :key="dict.id"
              :label="dict.menuName"
              :value="parseInt(dict.id)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="游戏名称" prop="gameName">
          <el-input v-model="form.gameName" placeholder="请输入游戏名称" />
        </el-form-item>
        <el-form-item label="游戏场次" prop="gameSession">
          <el-select v-model="form.gameSession" placeholder="请选择游戏场次">
            <el-option
              v-for="dict in dict.type.game_session"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="倍率配置" prop="odds">
          <el-input
            v-model="form.odds"
            placeholder="请输入倍率配置"
            oninput="value=value.replace(/[^\d\.]/g,'')"
          />
        </el-form-item>
        <el-form-item label="税收" prop="tax">
          <el-input
            v-model="form.tax"
            placeholder="请输入税收"
            oninput="value=value.replace(/[^\d\.]/g,'')"
          />
        </el-form-item>
        <el-form-item label="权重" prop="weight">
          <el-input
            v-model="form.weight"
            placeholder="请输入权重"
            oninput="value=value.replace(/[^\d\.]/g,'')"
          />
        </el-form-item>
        <el-form-item label="是否开启" prop="open">
          <el-select v-model="form.open" placeholder="请选择是否开启">
            <el-option
              v-for="dict in dict.type.game_open"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动场" prop="isActivity">
          <el-select v-model="form.isActivity" placeholder="请选择是否活动场">
            <el-option
              v-for="dict in dict.type.is_activty"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
          <el-input
            style="width:470px;"
            v-if="form.isActivity==1"
            v-model="form.activityDesc"
            placeholder="请输入活动场描述"
          />
          <div class="global-text-red">&nbsp;开启活动不参与代理返佣</div>
        </el-form-item>
        <el-form-item style="margin-top:30px;" label="是否返佣" prop="isBrokerage">
          <el-select v-model="form.isBrokerage" placeholder="请选择是否参与返佣">
            <el-option
              v-for="dict in dict.type.is_brokerage"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="item.title" v-for="(item, index) in form.betRuleList" :key="index">
          <!-- <el-input v-model="form.betRule" type="textarea" class="textarea" placeholder="请输入内容" /> -->
          <div>
            <span class="label">最小投注</span>
            <el-input
              class="my-input"
              oninput="value=value.replace(/[^\d]/g,'')"
              v-model="item.betMinLimit"
              type="text"
              placeholder="请输入内容"
              clearable
            />
            <span class="label">最大投注</span>
            <el-input
              class="my-input"
              oninput="value=value.replace(/[^\d]/g,'')"
              v-model="item.betMaxLimit"
              type="text"
              placeholder="请输入内容"
              clearable
            />
          </div>
        </el-form-item>
        <!-- <el-form-item label="TRX规则">
          <div>
            <span class="label">最小投注</span>
            <el-input class="my-input" oninput="value=value.replace(/[^\d]/g,'')" v-model="form.trxMin" type="text"
              placeholder="请输入内容" clearable />
            <span class="label">最大投注</span>
            <el-input class="my-input" oninput="value=value.replace(/[^\d]/g,'')" v-model="form.trxMax" type="text"
              placeholder="请输入内容" clearable />
          </div>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="!isDetail" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listConfig, getConfig, delConfig, addConfig, updateConfig } from '@/api/hash-game/config'
import { listGameMenu } from '@/api/hash-game/gameMenu'
export default {
  name: 'Config',
  dicts: ['game_open', 'game_session', 'is_activty', 'is_brokerage', 'game_list'],
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
      configList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        gameName: null,
        gameSession: null,
        odds: null,
        open: null,
        isActivity: null,
        finishTime: null,
        sort: 'asc',
        orderByColumn: 'createTime',
        isAsc: 'desc',
        weight: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        gameId: [{ required: true, message: '请选择游戏菜单', trigger: 'blur' }],
        gameName: [{ required: true, message: '请输入游戏名称', trigger: 'blur' }],
        gameSession: [{ required: true, message: '请选择游戏场次', trigger: 'blur' }],
        odds: [{ required: true, message: '请输入游戏倍率', trigger: 'blur' }],
        tax: [{ required: true, message: '请输入游戏税收', trigger: 'blur' }],
        open: [{ required: true, message: '请选择是否开启', trigger: 'blur' }],
        isActivity: [{ required: true, message: '请选择活动场', trigger: 'blur' }],
        isBrokerage: [{ required: true, message: '请选择是否返佣', trigger: 'blur' }],
        weight: [{ required: true, message: '请输入权重', trigger: 'blur' }],
      },
      gameMenuList: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    tableRowClassName({
      row,
      rowIndex,
    }) {
      if (row.open == 1) {
        return 'green'
      }
      return 'red'
    },
    getMenuList() {
      listGameMenu({
        pageNum: 1,
        pageSize: 100
      }).then(response => {
        this.gameMenuList = response.rows
      })
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
    /** 查询游戏配置列表 */
    getList() {
      this.loading = true
      listConfig(this.queryParams).then(response => {
        this.configList = response.rows
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
        gameId: null,
        gameName: null,
        gameSession: null,
        betRule: null,
        odds: null,
        tax: null,
        open: null,
        isActivity: null,
        finishTime: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null,
        orderByColumn: 'createTime',
        isAsc: 'desc',
        weight: null
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
      this.getMenuList()
      this.form.betRuleList = [
        {
          betMaxLimit: 500000,
          betMinLimit: 10,
          name: 'USDT',
          title: 'USDT规则'
        },
        {
          betMaxLimit: 1000000,
          betMinLimit: 1000,
          name: 'TRX',
          title: 'TRX规则'
        }
      ]
      this.open = true
      this.title = '添加游戏配置'
    },
    /** 修改按钮操作 */
    handleUpdate(row, isDetail) {
      this.isDetail = isDetail
      // this.reset();
      const id = row ? row.id : this.ids
      this.getMenuList()
      getConfig(id).then(response => {
        this.form = response.data
        this.title = '修改游戏配置'
        this.open = true
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          let obj = {}
          this.form.betRuleList.forEach(element => {
            // if (element.name == "USDT") {
            //   obj.USDT = element
            // }
            var name = element.name
            delete element.name
            delete element.title
            obj[name] = element
          })

          this.form.betRule = JSON.stringify(obj)

          console.log(this.form)

          if (this.form.id != null) {
            updateConfig(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addConfig(this.form).then(response => {
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
        .confirm('是否确认删除游戏配置编号为"' + ids + '"的数据项？')
        .then(function () {
          return delConfig(ids)
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
        'hash-game/config/export',
        {
          ...this.queryParams
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
</style>
