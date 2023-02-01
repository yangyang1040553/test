<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="广告名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入广告名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="是否开启" prop="enable">
        <el-select v-model="queryParams.enable" placeholder="请选择是否开启" clearable>
          <el-option v-for="dict in dict.type.articel_enable" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="广告位置" prop="position">
        <el-select v-model="queryParams.position" placeholder="请选择广告位置" clearable>
          <el-option v-for="dict in dict.type.articel_postion" :key="dict.value" :label="dict.label"
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
          v-hasPermi="['hashUser:advertise:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['hashUser:advertise:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['hashUser:advertise:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['hashUser:advertise:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="advertiseList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="${comment}" align="center" prop="id" /> -->
      <el-table-column label="广告名称" align="center" prop="name" />
      <el-table-column label="广告url" align="center" prop="url" />
      <el-table-column label="是否开启" align="center" prop="enable">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.articel_enable" :value="scope.row.enable" />
        </template>
      </el-table-column>
      <el-table-column label="广告位置" align="center" prop="position">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.articel_postion" :value="scope.row.position"/>
        </template>
      </el-table-column>
      <el-table-column label="跳转地址" align="center" prop="jumpUrl" />
      <el-table-column label="播放秒数" align="center" prop="seconds" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['hashUser:advertise:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['hashUser:advertise:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改用户意见对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="广告名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入广告名称" />
        </el-form-item>
        <el-form-item label="广告url" prop="url">
          <el-input v-model="form.url" placeholder="请输入广告url" />
        </el-form-item>
        <el-form-item label="是否开启" prop="enable">
          <el-select v-model="form.enable" placeholder="请选择是否开启">
            <el-option v-for="dict in dict.type.articel_enable" :key="dict.value" :label="dict.label"
              :value="parseInt(dict.value)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="跳转地址" prop="jumpUrl">
          <el-input v-model="form.jumpUrl" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="广告位置" prop="position">
					<el-select v-model="form.position" placeholder="请选择位置">
						<el-option v-for="dict in dict.type.articel_postion" :key="dict.value" :label="dict.label"
							:value="parseInt(dict.value)"></el-option>
					</el-select>
				</el-form-item>
        <el-form-item label="播放秒数" prop="seconds">
          <el-input v-model="form.seconds" placeholder="请输入播放秒数" />
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
import {
  listAdvertise,
  getAdvertise,
  delAdvertise,
  addAdvertise,
  updateAdvertise,
} from "@/api/hashUser/advertise";

export default {
  name: "Advertise",
  dicts: ["articel_enable", "articel_postion"],
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
      // 用户意见表格数据
      advertiseList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        enable: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询用户意见列表 */
    getList() {
      this.loading = true;
      listAdvertise(this.queryParams).then((response) => {
        this.advertiseList = response.rows;
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
        name: null,
        url: null,
        enable: null,
        seconds: null,
        createTime: null,
        updateTime: null,
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
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加用户意见";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getAdvertise(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改用户意见";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateAdvertise(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addAdvertise(this.form).then((response) => {
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
      this.$modal
        .confirm('是否确认删除用户意见编号为"' + ids + '"的数据项？')
        .then(function () {
          return delAdvertise(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "hashUser/advertise/export",
        {
          ...this.queryParams,
        },
        `advertise_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
