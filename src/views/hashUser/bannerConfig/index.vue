<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="是否跳转" prop="enable">
        <el-select v-model="queryParams.isSkip" placeholder="请选择是否跳转" clearable>
          <el-option v-for="dict in dict.type.is_skip" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="跳转的链接" prop="skipUrl">
        <el-input v-model="queryParams.skipUrl" placeholder="请输入跳转的链接" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="权重" prop="weight">
        <el-input v-model="queryParams.weight" placeholder="请输入权重" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="banner" prop="position">
        <el-select v-model="queryParams.position" placeholder="请选择位置" clearable>
          <el-option v-for="dict in dict.type.banner_position" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['hashUser:bannerConfig:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['hashUser:bannerConfig:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['hashUser:bannerConfig:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['hashUser:bannerConfig:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="bannerConfigList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="baner地址" align="center" prop="bannerUrl" />
      <el-table-column label="是否跳转" align="center" prop="isSkip">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.is_skip" :value="scope.row.isSkip" />
        </template>
      </el-table-column>
      <el-table-column label="跳转的链接" align="center" prop="skipUrl" />
      <el-table-column label="位置" align="center" prop="position">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.banner_position" :value="scope.row.position" />
        </template>
      </el-table-column>
      <el-table-column label="权重" align="center" prop="weight" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['hashUser:bannerConfig:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['hashUser:bannerConfig:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改Banner图对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="banner地址" prop="bannerUrl">
          <el-input v-model="form.bannerUrl" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="是否跳转" prop="isSkip">
          <el-select v-model="form.isSkip" placeholder="请选择是否跳转">
            <el-option v-for="dict in dict.type.is_skip" :key="dict.value" :label="dict.label"
              :value="parseInt(dict.value)"></el-option>
          </el-select>
          <!-- <el-input v-model="form.isSkip" placeholder="请输入${comment}" /> -->
        </el-form-item>
        <el-form-item label="跳转的链接" prop="skipUrl">
          <el-input v-model="form.skipUrl" placeholder="请输入跳转的链接" />
        </el-form-item>
        <el-form-item label="权重" prop="weight">
          <el-input v-model="form.weight" placeholder="请输入权重" />
        </el-form-item>
        <el-form-item label="位置" prop="position">
          <el-select v-model="form.position" placeholder="请选择位置">
            <el-option v-for="dict in dict.type.banner_position" :key="dict.value" :label="dict.label"
              :value="dict.value"></el-option>
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
import { listBannerConfig, getBannerConfig, delBannerConfig, addBannerConfig, updateBannerConfig } from "@/api/hashUser/bannerConfig";

export default {
  name: "BannerConfig",
  dicts: ["is_skip", "banner_position"],
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
      // Banner图表格数据
      bannerConfigList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        bannerUrl: null,
        isSkip: null,
        skipUrl: null,
        weight: null
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
    /** 查询Banner图列表 */
    getList() {
      this.loading = true;
      listBannerConfig(this.queryParams).then(response => {
        this.bannerConfigList = response.rows;
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
        bannerUrl: null,
        isSkip: null,
        skipUrl: null,
        weight: null
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
      this.title = "添加Banner图";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getBannerConfig(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改Banner图";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateBannerConfig(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addBannerConfig(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除Banner图编号为"' + ids + '"的数据项？').then(function () {
        return delBannerConfig(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('hashUser/bannerConfig/export', {
        ...this.queryParams
      }, `bannerConfig_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
