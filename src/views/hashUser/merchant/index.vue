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
      <el-form-item label="商户名" prop="merchantName">
        <el-input
          v-model="queryParams.merchantName"
          placeholder="请输入商户名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商户号" prop="merchantCode">
        <el-input
          v-model="queryParams.merchantCode"
          placeholder="请输入商户号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商户ID" prop="merchantNo">
        <el-input
          v-model="queryParams.merchantNo"
          placeholder="请输入商户ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商户密钥" prop="appKey">
        <el-input
          v-model="queryParams.appKey"
          placeholder="请输入商户密钥"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="回调通知地址" prop="notifyUrl">
        <el-input
          v-model="queryParams.notifyUrl"
          placeholder="请输入回调通知地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="接口请求地址" prop="apiUrl">
        <el-input
          v-model="queryParams.apiUrl"
          placeholder="请输入接口请求地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="接口查询地址" prop="queryUrl">
        <el-input
          v-model="queryParams.queryUrl"
          placeholder="请输入接口查询地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="IP白名单地址" prop="ipWhiteList">
        <el-input
          v-model="queryParams.ipWhiteList"
          placeholder="请输入IP白名单地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="超时时间" prop="timeout">
        <el-input
          v-model="queryParams.timeout"
          placeholder="请输入超时时间"
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
          v-hasPermi="['hashUser:merchant:add']"
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
          v-hasPermi="['hashUser:merchant:edit']"
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
          v-hasPermi="['hashUser:merchant:remove']"
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
          v-hasPermi="['hashUser:merchant:export']"
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
      :data="merchantList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="商户名" align="center" prop="merchantName" />
      <el-table-column label="商户号" align="center" prop="merchantCode" />
      <el-table-column label="商户ID" align="center" prop="merchantNo" />
      <el-table-column label="商户密钥" align="center" prop="appKey" />
      <el-table-column label="回调通知地址" align="center" prop="notifyUrl" />
      <el-table-column label="接口请求地址" align="center" prop="apiUrl" />
      <el-table-column label="接口查询地址" align="center" prop="queryUrl" />
      <el-table-column label="IP白名单地址" align="center" prop="ipWhiteList" />
      <el-table-column label="超时时间" align="center" prop="timeout" />
      <el-table-column
        label="状态, 1:启用, 2:禁用"
        align="center"
        prop="isEnable"
      >
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.is_enable"
            :value="scope.row.isEnable"
          />
        </template>
      </el-table-column>
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
            v-hasPermi="['hashUser:merchant:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['hashUser:merchant:remove']"
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

    <!-- 添加或修改支付商户配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="商户名" prop="merchantName">
          <el-input v-model="form.merchantName" placeholder="请输入商户名" />
        </el-form-item>
        <el-form-item label="商户号" prop="merchantCode">
          <el-input v-model="form.merchantCode" placeholder="请输入商户号" />
        </el-form-item>
        <el-form-item label="商户ID" prop="merchantNo">
          <el-input v-model="form.merchantNo" placeholder="请输入商户ID" />
        </el-form-item>
        <el-form-item label="商户密钥" prop="appKey">
          <el-input v-model="form.appKey" placeholder="请输入商户密钥" />
        </el-form-item>
        <el-form-item label="回调通知地址" prop="notifyUrl">
          <el-input v-model="form.notifyUrl" placeholder="请输入回调通知地址" />
        </el-form-item>
        <el-form-item label="接口请求地址" prop="apiUrl">
          <el-input v-model="form.apiUrl" placeholder="请输入接口请求地址" />
        </el-form-item>
        <el-form-item label="接口查询地址" prop="queryUrl">
          <el-input v-model="form.queryUrl" placeholder="请输入接口查询地址" />
        </el-form-item>
        <el-form-item label="IP白名单地址" prop="ipWhiteList">
          <el-input
            v-model="form.ipWhiteList"
            placeholder="请输入IP白名单地址"
          />
        </el-form-item>
        <el-form-item label="超时时间" prop="timeout">
          <el-input v-model="form.timeout" placeholder="请输入超时时间" />
        </el-form-item>
        <el-form-item label="状态" prop="isEnable">
          <el-select
            v-model="form.isEnable"
            placeholder="请选择状态"
          >
            <el-option
              v-for="dict in dict.type.is_enable"
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
import {
  listMerchant,
  getMerchant,
  delMerchant,
  addMerchant,
  updateMerchant,
} from "@/api/hashUser/merchant";

export default {
  name: "Merchant",
  dicts: ["is_enable"],
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
      // 支付商户配置表格数据
      merchantList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        merchantName: null,
        merchantCode: null,
        merchantNo: null,
        appKey: null,
        notifyUrl: null,
        apiUrl: null,
        queryUrl: null,
        ipWhiteList: null,
        timeout: null,
        isEnable: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        merchantName: [
          { required: true, message: "商户名不能为空", trigger: "blur" },
        ],
        merchantCode: [
          { required: true, message: "商户号不能为空", trigger: "blur" },
        ],
        merchantNo: [
          { required: true, message: "商户ID不能为空", trigger: "blur" },
        ],
        isEnable: [
          {
            required: true,
            message: "状态, 1:启用, 2:禁用不能为空",
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
    /** 查询支付商户配置列表 */
    getList() {
      this.loading = true;
      listMerchant(this.queryParams).then((response) => {
        this.merchantList = response.rows;
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
        merchantName: null,
        merchantCode: null,
        merchantNo: null,
        appKey: null,
        notifyUrl: null,
        apiUrl: null,
        queryUrl: null,
        ipWhiteList: null,
        timeout: null,
        isEnable: null,
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
      this.title = "添加支付商户配置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getMerchant(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改支付商户配置";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateMerchant(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addMerchant(this.form).then((response) => {
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
        .confirm('是否确认删除支付商户配置编号为"' + ids + '"的数据项？')
        .then(function () {
          return delMerchant(ids);
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
        "hashUser/merchant/export",
        {
          ...this.queryParams,
        },
        `merchant_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
