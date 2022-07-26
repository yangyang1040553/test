<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="存储类型" prop="ossType">
        <el-select v-model="queryParams.ossType" placeholder="请选择存储类型" clearable>
          <el-option
            v-for="dict in dict.type.oss_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="存储桶名称" prop="bucketName">
        <el-input
          v-model="queryParams.bucketName"
          placeholder="请输入存储桶名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="访问ID配置" prop="accessId">
        <el-input
          v-model="queryParams.accessId"
          placeholder="请输入访问ID配置"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="访问Key配置" prop="accessKey">
        <el-input
          v-model="queryParams.accessKey"
          placeholder="请输入访问Key配置"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="上传地址" prop="uploadAddr">
        <el-input
          v-model="queryParams.uploadAddr"
          placeholder="请输入上传地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="访问地址" prop="accessAddr">
        <el-input
          v-model="queryParams.accessAddr"
          placeholder="请输入访问地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="健康状态" prop="satus">
        <el-select v-model="queryParams.satus" placeholder="请选择健康状态" clearable>
          <el-option
            v-for="dict in dict.type.healthy_status"
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
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['hash-operation:dkOss:add']"
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
          v-hasPermi="['hash-operation:dkOss:edit']"
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
          v-hasPermi="['hash-operation:dkOss:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hash-operation:dkOss:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      height="600"
      :data="dkOssList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="存储类型" align="center" prop="ossType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.oss_type" :value="scope.row.ossType" />
        </template>
      </el-table-column>
      <el-table-column label="存储桶名称" align="center" prop="bucketName" />
      <el-table-column label="访问ID配置" align="center" prop="accessId" />
      <el-table-column label="访问Key配置" align="center" prop="accessKey" />
      <el-table-column label="上传地址" align="center" prop="uploadAddr" />
      <el-table-column label="访问地址" align="center" prop="accessAddr" />
      <el-table-column label="健康状态" align="center" prop="satus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.healthy_status" :value="scope.row.satus" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="center" prop="updateTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新者" align="center" prop="updateBy" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['hash-operation:dkOss:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['hash-operation:dkOss:remove']"
          >删除</el-button>
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

    <!-- 添加或修改对抗存储列对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="存储桶名称" prop="bucketName">
          <el-input v-model="form.bucketName" placeholder="请输入存储桶名称" />
        </el-form-item>
        <el-form-item label="访问ID配置" prop="accessId">
          <el-input v-model="form.accessId" placeholder="请输入访问ID配置" />
        </el-form-item>
        <el-form-item label="访问Key配置" prop="accessKey">
          <el-input v-model="form.accessKey" placeholder="请输入访问Key配置" />
        </el-form-item>
        <el-form-item label="上传地址" prop="uploadAddr">
          <el-input v-model="form.uploadAddr" placeholder="请输入上传地址" />
        </el-form-item>
        <el-form-item label="访问地址" prop="accessAddr">
          <el-input v-model="form.accessAddr" placeholder="请输入访问地址" />
        </el-form-item>
        <el-form-item label="存储类型" prop="ossType">
          <el-select v-model="form.ossType" placeholder="请选择存储类型">
            <el-option
              v-for="dict in dict.type.oss_type"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="健康状态" prop="satus">
          <el-select v-model="form.satus" placeholder="请选择健康状态">
            <el-option
              v-for="dict in dict.type.healthy_status"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
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
import { listDkOss, getDkOss, delDkOss, addDkOss, updateDkOss } from "@/api/hash-operation/dkOss";

export default {
  name: "DkOss",
  dicts: ['oss_type', 'healthy_status'],
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
      // 对抗存储列表格数据
      dkOssList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        ossType: null,
        bucketName: null,
        accessId: null,
        accessKey: null,
        uploadAddr: null,
        accessAddr: null,
        satus: null,
        createTime: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        ossType: [
          { required: true, message: "存储类型 1阿里云 2腾讯云 3github不能为空", trigger: "change" }
        ],
        bucketName: [
          { required: true, message: "存储桶名称不能为空", trigger: "blur" }
        ],
        accessId: [
          { required: true, message: "访问ID配置不能为空", trigger: "blur" }
        ],
        accessKey: [
          { required: true, message: "访问Key配置不能为空", trigger: "blur" }
        ],
        uploadAddr: [
          { required: true, message: "上传地址不能为空", trigger: "blur" }
        ],
        accessAddr: [
          { required: true, message: "访问地址不能为空", trigger: "blur" }
        ],
        satus: [
          { required: true, message: "健康状态 0健康 1异常不能为空", trigger: "change" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询对抗存储列列表 */
    getList() {
      this.loading = true;
      listDkOss(this.queryParams).then(response => {
        this.dkOssList = response.rows;
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
        ossType: null,
        bucketName: null,
        accessId: null,
        accessKey: null,
        uploadAddr: null,
        accessAddr: null,
        satus: null,
        createTime: null,
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
      this.title = "添加对抗存储列";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getDkOss(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改对抗存储列";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateDkOss(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDkOss(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除对抗存储列编号为"' + ids + '"的数据项？').then(function () {
        return delDkOss(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('hash-operation/dkOss/export', {
        ...this.queryParams
      }, `dkOss_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
