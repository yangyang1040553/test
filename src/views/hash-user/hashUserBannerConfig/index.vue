<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="banner" prop="bannerUrl">
        <el-input v-model="queryParams.bannerUrl" placeholder="请输入banner的url" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="是否外链" prop="isSkip">
        <el-select v-model="queryParams.isSkip" placeholder="请选择是否外链" clearable>
          <el-option v-for="dict in dict.type.is_skip" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="跳转链接" prop="skipUrl">
        <el-input v-model="queryParams.skipUrl" placeholder="请输入跳转的链接" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="权重" prop="weight"><el-input v-model="queryParams.weight" placeholder="请输入权重" clearable @keyup.enter.native="handleQuery" /></el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['hash-user:hashUserBannerConfig:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['hash-user:hashUserBannerConfig:edit']">
          修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['hash-user:hashUserBannerConfig:remove']">
          删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['hash-user:hashUserBannerConfig:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" @sort-change="sortChange" :data="hashUserBannerConfigList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="banner" align="center" prop="bannerUrl" width="300">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <div class="hover-div">{{ scope.row.bannerUrl }}</div>
            <div class="text-content name-wrapper" slot="reference">{{ scope.row.bannerUrl }}</div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="是否外链" align="center" prop="isSkip">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.is_skip" :value="scope.row.isSkip" />
        </template>
      </el-table-column>
      <el-table-column label="链接" align="center" prop="skipUrl" width="300" />
      <el-table-column label="权重" align="center" prop="weight" sortable />
      <el-table-column label="创建者" align="center" prop="createBy" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180" sortable />
      <el-table-column label="更新者" align="center" prop="updateBy" />
      <el-table-column label="更新时间" align="center" prop="updateTime" width="180" sortable />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['hash-user:hashUserBannerConfig:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['hash-user:hashUserBannerConfig:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改用户首页的banner列对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="banner" prop="bannerUrl"><el-input v-model="form.bannerUrl" placeholder="请输入banner的url" /></el-form-item>
        <el-form-item label="是否外链" prop="isSkip">
          <el-row>
            <el-col :span="6">
              <el-select v-model="form.isSkip" placeholder="请选择是否外链">
                <el-option v-for="dict in dict.type.is_skip" :key="dict.value" :label="dict.label" :value="parseInt(dict.value)"></el-option>
              </el-select>
            </el-col>
            <el-col :span="18"><el-input v-if="form.isSkip == 1" v-model="form.skipUrl" placeholder="请输入跳转的链接" /></el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="权重" prop="weight"><el-input v-model="form.weight" placeholder="请输入权重" /></el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listHashUserBannerConfig,
  getHashUserBannerConfig,
  delHashUserBannerConfig,
  addHashUserBannerConfig,
  updateHashUserBannerConfig
} from '@/api/hash-user/hashUserBannerConfig'

export default {
  name: 'HashUserBannerConfig',
  dicts: ['is_skip'],
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
      // 用户首页的banner列表格数据
      hashUserBannerConfigList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        bannerUrl: null,
        isSkip: null,
        skipUrl: null,
        weight: null,
        sort: 'desc',
        orderByColumn: 'createTime',
        isAsc: 'desc'
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        bannerUrl: [{ required: true, message: 'banner的url不能为空', trigger: 'blur' }],
        isSkip: [{ required: true, message: '是否跳转 0否 1是不能为空', trigger: 'change' }],
        skipUrl: [{ required: true, message: '跳转的链接不能为空', trigger: 'blur' }],
        weight: [{ required: true, message: '权重不能为空', trigger: 'blur' }],
        createTime: [{ required: true, message: '创建时间不能为空', trigger: 'blur' }],
        createBy: [{ required: true, message: '创建者不能为空', trigger: 'blur' }],
        updateTime: [{ required: true, message: '更新时间不能为空', trigger: 'blur' }],
        updateBy: [{ required: true, message: '更新者不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
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
    /** 查询用户首页的banner列列表 */
    getList() {
      this.loading = true
      listHashUserBannerConfig(this.queryParams).then(response => {
        this.hashUserBannerConfigList = response.rows
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
        bannerUrl: null,
        isSkip: null,
        skipUrl: null,
        weight: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null,
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
      this.title = '添加用户首页的banner列'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getHashUserBannerConfig(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改用户首页的banner'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          //非外链 跳转链接为空
          if (!this.form.isSkip) {
            this.form.skipUrl = ''
          }
          if (this.form.id != null) {
            updateHashUserBannerConfig(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addHashUserBannerConfig(this.form).then(response => {
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
        .confirm('是否确认删除用户首页的banner列编号为"' + ids + '"的数据项？')
        .then(function() {
          return delHashUserBannerConfig(ids)
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess('删除成功')
        })
        .catch(() => {})
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        'hash-user/hashUserBannerConfig/export',
        {
          ...this.queryParams
        },
        `hashUserBannerConfig_${new Date().getTime()}.xlsx`
      )
    }
  }
}
</script>
<style lang="scss" scoped>
.text-content {
  max-height: 50px !important;
  overflow: hidden;
}

.hover-div {
  max-width: 300px;
}
</style>
