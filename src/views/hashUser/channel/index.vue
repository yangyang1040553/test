<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="100px"
    >
      <el-form-item label="通道名称" prop="channelName">
        <el-input
          v-model="queryParams.channelName"
          placeholder="请输入通道名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="通道编码" prop="channelCode">
        <el-input
          v-model="queryParams.channelCode"
          placeholder="请输入通道编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商户编号" prop="merchantCode">
        <el-input
          v-model="queryParams.merchantCode"
          placeholder="请输入商户编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="支付方式号" prop="payTypeNo">
        <el-input
          v-model="queryParams.payTypeNo"
          placeholder="请输入支付方式号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="渠道编码" prop="channelNo">
        <el-input
          v-model="queryParams.channelNo"
          placeholder="请输入渠道编码"
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
      <el-form-item label="状态" prop="isEnable">
        <el-select
          v-model="queryParams.isEnable"
          placeholder="请选择状态"
          clearable
        >
          <el-option
            v-for="dict in dict.type.is_enable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="固定金额" prop="isFix">
        <el-select
          v-model="queryParams.isFix"
          placeholder="请选择是否固定金额"
          clearable
        >
          <el-option
            v-for="dict in dict.type.is_fix"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="最小单笔限额" prop="minAmount">
        <el-input
          v-model="queryParams.minAmount"
          placeholder="请输入最小单笔限额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="最大单笔限额" prop="maxAmount">
        <el-input
          v-model="queryParams.maxAmount"
          placeholder="请输入最大单笔限额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="固定金额" prop="fixAmount">
        <el-input
          v-model="queryParams.fixAmount"
          placeholder="请输入固定金额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
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
          v-hasPermi="['hashUser:channel:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['hashUser:channel:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['hashUser:channel:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hashUser:channel:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="channelList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="通道名称" align="center" prop="channelName" />
      <el-table-column label="通道编码" align="center" prop="channelCode" />
      <el-table-column label="商户编号" align="center" prop="merchantCode" />
      <el-table-column label="支付方式号" align="center" prop="payTypeNo" />
      <el-table-column label="渠道编码" align="center" prop="channelNo" />
      <el-table-column label="权重" align="center" prop="weight" />
      <el-table-column label="状态" align="center" prop="isEnable">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.is_enable"
            :value="scope.row.isEnable"
          />
        </template>
      </el-table-column>
      <el-table-column label="固定金额" align="center" prop="isFix">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.is_fix" :value="scope.row.isFix" />
        </template>
      </el-table-column>
      <el-table-column label="最小单笔限额" align="center" prop="minAmount" />
      <el-table-column label="最大单笔限额" align="center" prop="maxAmount" />
      <el-table-column label="固定金额" align="center" prop="fixAmount" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['hashUser:channel:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['hashUser:channel:remove']"
            >删除</el-button
          >
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

    <!-- 添加或修改支付通道配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="通道名称" prop="channelName">
          <el-input v-model="form.channelName" placeholder="请输入通道名称" />
        </el-form-item>
        <el-form-item label="通道编码" prop="channelCode">
          <el-input v-model="form.channelCode" placeholder="请输入通道编码" />
        </el-form-item>
        <el-form-item label="商户编号" prop="merchantCode">
          <el-input v-model="form.merchantCode" placeholder="请输入商户编号" />
        </el-form-item>
        <el-form-item label="支付方式号" prop="payTypeNo">
          <el-input v-model="form.payTypeNo" placeholder="请输入支付方式号" />
        </el-form-item>
        <el-form-item label="渠道编码" prop="channelNo">
          <el-input v-model="form.channelNo" placeholder="请输入渠道编码" />
        </el-form-item>
        <el-form-item label="权重" prop="weight">
          <el-input v-model="form.weight" placeholder="请输入权重" />
        </el-form-item>
        <el-form-item label="状态" prop="isEnable">
          <el-select
            v-model="form.isEnable"
            placeholder="请选择状态  1=启用 2=禁用"
          >
            <el-option
              v-for="dict in dict.type.is_enable"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="固定金额" prop="isFix">
          <el-select
            v-model="form.isFix"
            placeholder="请选择是否固定金额"
          >
            <el-option
              v-for="dict in dict.type.is_fix"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="最小单笔限额" prop="minAmount">
          <el-input v-model="form.minAmount" placeholder="请输入最小单笔限额" />
        </el-form-item>
        <el-form-item label="最大单笔限额" prop="maxAmount">
          <el-input v-model="form.maxAmount" placeholder="请输入最大单笔限额" />
        </el-form-item>
        <el-form-item label="固定金额" prop="fixAmount">
          <el-input v-model="form.fixAmount" placeholder="请输入固定金额" />
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
  listChannel,
  getChannel,
  delChannel,
  addChannel,
  updateChannel,
} from "@/api/hashUser/channel";

export default {
  name: "Channel",
  dicts: ["is_fix", "is_enable"],
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
      // 支付通道配置表格数据
      channelList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        channelName: null,
        channelCode: null,
        merchantCode: null,
        payTypeNo: null,
        channelNo: null,
        weight: null,
        isEnable: null,
        isFix: null,
        minAmount: null,
        maxAmount: null,
        fixAmount: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        channelName: [
          { required: true, message: "通道名称不能为空", trigger: "blur" },
        ],
        channelCode: [
          { required: true, message: "通道编码不能为空", trigger: "blur" },
        ],
        merchantCode: [
          { required: true, message: "商户编号不能为空", trigger: "blur" },
        ],
        payTypeNo: [
          { required: true, message: "支付方式号不能为空", trigger: "blur" },
        ],
        channelNo: [
          { required: true, message: "渠道编码不能为空", trigger: "blur" },
        ],
        isEnable: [
          {
            required: true,
            message: "状态  1=启用 2=禁用不能为空",
            trigger: "change",
          },
        ],
        isFix: [
          {
            required: true,
            message: "是否固定金额 0.不是 1.是不能为空",
            trigger: "change",
          },
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" },
        ],
        updateTime: [
          { required: true, message: "更新时间不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询支付通道配置列表 */
    getList() {
      this.loading = true;
      listChannel(this.queryParams).then((response) => {
        this.channelList = response.rows;
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
        channelName: null,
        channelCode: null,
        merchantCode: null,
        payTypeNo: null,
        channelNo: null,
        weight: null,
        isEnable: null,
        isFix: null,
        minAmount: null,
        maxAmount: null,
        fixAmount: null,
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
      this.title = "添加支付通道配置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getChannel(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改支付通道配置";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateChannel(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addChannel(this.form).then((response) => {
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
        .confirm('是否确认删除支付通道配置编号为"' + ids + '"的数据项？')
        .then(function () {
          return delChannel(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "hashUser/channel/export",
        {
          ...this.queryParams,
        },
        `channel_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
