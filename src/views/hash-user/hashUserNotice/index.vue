<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="88px">
      <el-form-item label="公告标题" prop="title">
        <el-input v-model="queryParams.title" placeholder="请输入公告标题" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="活动活动" prop="isOpen">
        <el-select v-model="queryParams.isOpen" placeholder="请选择是否开启" clearable>
          <el-option v-for="dict in dict.type.is_open" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker clearable v-model="queryParams.createTime" type="date" value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="请选择创建时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['hash-user:hashUserNotice:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['hash-user:hashUserNotice:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['hash-user:hashUserNotice:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['hash-user:hashUserNotice:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="hashUserNoticeList" @selection-change="handleSelectionChange" height="600"
      @sort-change="sortChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="公告标题" align="center" prop="title" />
      <el-table-column label="公告内容" align="center" prop="content">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <div class="hover-div">{{ scope.row.content }}</div>
            <div class="text-content name-wrapper" slot="reference">{{ scope.row.content }}</div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="活动开启" align="center" prop="isOpen">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.is_open" :value="scope.row.isOpen" />
        </template>
      </el-table-column>
      <el-table-column label="公告创建时间" align="center" prop="createTime" width="180" sortable>
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="公告结束时间" align="center" prop="finishTime" width="180" sortable>
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.finishTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['hash-user:hashUserNotice:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['hash-user:hashUserNotice:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改用户公告对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" class="form">
        <el-form-item label="公告标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入公告标题" />
        </el-form-item>
        <el-form-item label="活动开启" prop="isOpen">
          <el-select v-model="form.isOpen" placeholder="请选择是否开启">
            <el-option v-for="dict in dict.type.is_open" :key="dict.value" :label="dict.label"
              :value="parseInt(dict.value)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="结束时间" prop="finishTime">
          <el-date-picker clearable v-model="form.finishTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择公告结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="公告内容">
          <editor v-model="form.content" :min-height="260" />
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
import { listHashUserNotice, getHashUserNotice, delHashUserNotice, addHashUserNotice, updateHashUserNotice } from "@/api/hash-user/hashUserNotice";

export default {
  name: "HashUserNotice",
  dicts: ['is_open'],
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
      // 用户公告表格数据
      hashUserNoticeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: null,
        isOpen: null,
        createTime: null,
        sort: 'asc',
        prop: 'create_time'
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
    /** 查询用户公告列表 */
    getList() {
      this.loading = true;
      listHashUserNotice(this.queryParams).then(response => {
        this.hashUserNoticeList = response.rows;
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
        title: null,
        content: null,
        isOpen: null,
        finishTime: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null
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
      this.title = "添加用户公告";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getHashUserNotice(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改用户公告";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateHashUserNotice(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addHashUserNotice(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除用户公告编号为"' + ids + '"的数据项？').then(function () {
        return delHashUserNotice(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('hash-user/hashUserNotice/export', {
        ...this.queryParams
      }, `hashUserNotice_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
<style lang="scss" scoped>
.form {
  height: 500px;
}


.text-content {
  max-height: 50px !important;
  overflow: hidden;
}

.hover-div {
  max-width: 300px;
}
</style>