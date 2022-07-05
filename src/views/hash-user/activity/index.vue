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
      <el-form-item label="唯一id" prop="id">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入唯一id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="活动名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入活动名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="落地页" prop="landingPageUrl">
        <el-input
          v-model="queryParams.landingPageUrl"
          placeholder="请输入落地页URL地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否开启" prop="open">
        <el-select v-model="queryParams.open" placeholder="请选择是否开启" clearable>
          <el-option
            v-for="dict in dict.type.is_open"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="结束时间" prop="finishTime">
        <el-date-picker
          clearable
          v-model="queryParams.finishTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择结束时间"
        ></el-date-picker>
      </el-form-item>
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
          v-hasPermi="['hash-user:activity:add']"
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
          v-hasPermi="['hash-user:activity:edit']"
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
          v-hasPermi="['hash-user:activity:remove']"
        >删除</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hash-user:activity:export']"
        >导出</el-button>
      </el-col> -->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      @sort-change="sortChange"
      :data="activityList"
      :row-class-name="tableRowClassName"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="唯一id" align="center" prop="id" />
      <el-table-column label="活动名称" align="center" prop="name" />
      <el-table-column label="banner" align="center" prop="bannerUrl" width="200">
        <template slot-scope="scope">
          <img style="height:90px;" :src="scope.row.bannerUrl" />
        </template>
      </el-table-column>
      <el-table-column label="落地页" align="center" prop="landingPageUrl" />
      <el-table-column label="活动类型" align="center" prop="operationId">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.operation_type" :value="scope.row.operationId" />
        </template>
      </el-table-column>
      <el-table-column label="是否开启" align="center" prop="open">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.is_open" :value="scope.row.open" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180" sortable>
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center" prop="finishTime" width="180" sortable>
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.finishTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['hash-user:activity:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['hash-user:activity:remove']"
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

    <!-- 添加或修改用户的活动对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" class="form" label-width="80px">
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入活动名称" />
        </el-form-item>
        <!-- <el-form-item label="banner" prop="bannerUrl">
          <el-input v-model="form.bannerUrl" placeholder="请输入banner图的链接" />
        </el-form-item>-->
        <el-form-item label="落地页" prop="landingPageUrl">
          <el-input v-model="form.landingPageUrl" placeholder="请输入落地页URL地址" />
        </el-form-item>
        <el-form-item label="是否开启" prop="open">
          <el-select v-model="form.open" placeholder="请选择是否开启">
            <el-option
              v-for="dict in dict.type.is_open"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="结束时间" prop="finishTime">
          <el-date-picker
            clearable
            v-model="form.finishTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择结束时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="活动类型" prop="operationId">
          <el-select v-model="form.operationId" placeholder="请选择活动类型">
            <el-option
              v-for="dict in dict.type.operation_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="banner" prop="bannerUrl">
          <UploadVue :url="form.bannerUrl" @setImageUrl="setImageUrl" />
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
import { listActivity, getActivity, delActivity, addActivity, updateActivity } from '@/api/hash-user/activity'
// import { listActivity as operaListActivity } from "@/api/hash-operation/activity";
import UploadVue from '../../components/upload/Upload.vue'
export default {
  name: 'Activity',
  dicts: ['is_open', 'operation_type'],
  components: { UploadVue },
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
      // 用户的活动表格数据
      activityList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: null,
        name: null,
        landingPageUrl: null,
        open: null,
        finishTime: null,
        orderByColumn: 'createTime',
        isAsc: 'desc'
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [{ required: true, message: '活动名称不能为空', trigger: 'blur' }],
        bannerUrl: [{ required: true, message: 'banner图的链接不能为空', trigger: 'blur' }],
        landingPageUrl: [{ required: true, message: '落地页URL地址不能为空', trigger: 'blur' }],
        open: [{ required: true, message: '状态不能为空', trigger: 'change' }],
        finishTime: [{ required: true, message: '结束时间不能为空', trigger: 'blur' }],
        operationId: [{ required: true, message: '请选择活动类型', trigger: 'blur' }],
      },
      operaList: []
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
    setImageUrl(url) {
      console.log("url==", url)
      this.form.bannerUrl = url
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
    /** 查询用户的活动列表 */
    getList() {
      this.loading = true
      listActivity(this.queryParams).then(response => {
        this.activityList = response.rows
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
        name: null,
        bannerUrl: null,
        landingPageUrl: null,
        open: null,
        finishTime: null,
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
      this.title = '添加用户的活动'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getActivity(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改用户的活动'
      })
      // operaListActivity().then(response => {
      //   this.operaList = response.data
      // })

    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateActivity(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addActivity(this.form).then(response => {
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
        .confirm('是否确认删除用户的活动编号为"' + ids + '"的数据项？')
        .then(function () {
          return delActivity(ids)
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
        'hash-user/activity/export',
        {
          ...this.queryParams
        },
        `activity_${new Date().getTime()}.xlsx`
      )
    }
  }
}
</script>
<style lang="scss" scoped>
.form {
  height: 50vh;
}
</style>