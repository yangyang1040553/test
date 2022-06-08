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
      <el-form-item label="玩家ID" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入玩家ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="玩家昵称" prop="nickName">
        <el-input v-model="queryParams.nickName" placeholder="请输入玩家昵称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>-->
      <el-form-item label="反馈类型" prop="code">
        <el-select v-model="queryParams.code" placeholder="请选择反馈类型" clearable>
          <el-option
            v-for="dict in dict.type.back_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          clearable
          v-model="queryParams.createTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择创建时间"
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
          v-hasPermi="['hash-user:feedback:add']">新增</el-button>
      </el-col>-->
      <!-- <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['hash-user:feedback:edit']">修改</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['hash-user:feedback:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hash-user:feedback:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      @sort-change="sortChange"
      :data="feedbackList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="唯一id" align="center" prop="id" />
      <el-table-column label="反馈类型" align="center" prop="code">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.back_type" :value="scope.row.code" />
        </template>
      </el-table-column>
      <el-table-column label="玩家ID" align="center" prop="userId" />
      <el-table-column label="玩家昵称" align="center" prop="nickName" />
      <el-table-column label="内容" align="center" prop="content" width="200">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <div class="hover-div">{{ scope.row.content }}</div>
            <div class="text-content name-wrapper" slot="reference">{{ scope.row.content }}</div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="时间" align="center" prop="createTime" width="160" sortable />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-zoom-in"
            @click="handleUpdate(scope.row)"
          >详情</el-button>
          <!-- <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
          v-hasPermi="['hash-user:feedback:edit']">修改</el-button>-->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['hash-user:feedback:remove']"
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

    <!-- 添加或修改用户意见反馈对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="900px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" class="dialog">
        <el-form-item label="反馈类型" prop="code">
          <el-select v-model="form.code" placeholder="请选择反馈类型">
            <el-option
              v-for="dict in dict.type.back_type"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="玩家ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入玩家ID" />
        </el-form-item>
        <el-form-item label="玩家昵称" prop="nickName">
          <el-input v-model="form.nickName" placeholder="请输入玩家昵称" />
        </el-form-item>
        <el-form-item label="内容">
          <editor v-model="form.content" :min-height="400" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button type="primary" @click="submitForm">确 定</el-button> -->
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listFeedback, getFeedback, delFeedback, addFeedback, updateFeedback } from '@/api/hash-user/feedback'

export default {
  name: 'Feedback',
  dicts: ['back_type'],
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
      // 用户意见反馈表格数据
      feedbackList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        code: null,
        userId: null,
        nickName: null,
        createTime: null,
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
    console.log('this.$route.query.userId==', this.$route.query)
    if (this.$route.query.userId) {
      this.queryParams.userId = this.$route.query.userId
    }
    this.getList()
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
    /** 查询用户意见反馈列表 */
    getList() {
      this.loading = true
      listFeedback(this.queryParams).then(response => {
        this.feedbackList = response.rows
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
        code: null,
        userId: null,
        nickName: null,
        content: null,
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
      this.title = '添加用户意见反馈'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getFeedback(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改用户意见反馈'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateFeedback(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addFeedback(this.form).then(response => {
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
        .confirm('是否确认删除用户意见反馈编号为"' + ids + '"的数据项？')
        .then(function () {
          return delFeedback(ids)
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
        'hash-user/feedback/export',
        {
          ...this.queryParams
        },
        `feedback_${new Date().getTime()}.xlsx`
      )
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog {
  height: 70vh;
}

.text-content {
  max-height: 50px !important;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  // height: 50px;
  // line-height: 50px;
  text-align: center;
  white-space: nowrap;
}

.hover-div {
  max-width: 300px;
}
</style>
