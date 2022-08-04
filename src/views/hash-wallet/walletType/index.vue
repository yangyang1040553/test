<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
    >
      <!-- <el-form-item label="支付列别名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入支付列别名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="列表编号" prop="payTypeNo">
        <el-input
          v-model="queryParams.payTypeNo"
          placeholder="请输入列表编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <el-form-item label="状态" prop="isEnable">
        <el-select v-model="queryParams.isEnable" placeholder="请选择状态" clearable>
          <el-option
            v-for="dict in dict.type.is_enable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="排序字段 升序" prop="sort">
        <el-input
          v-model="queryParams.sort"
          placeholder="请输入排序字段 升序"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="icon图片地址" prop="iconUrl">
        <el-input
          v-model="queryParams.iconUrl"
          placeholder="请输入icon图片地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          clearable
          v-model="queryParams.createTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择创建时间"
        ></el-date-picker>
      </el-form-item>-->
      <el-form-item label="支付方式号" prop="payTypeNo">
        <!-- <el-input v-model="form.payTypeNo" placeholder="请输入支付方式号" /> -->
        <el-select v-model="queryParams.payTypeNo" placeholder="请选择商户编号" clearable>
          <el-option
            v-for="dict in dict.type.pay_type_no"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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
          v-hasPermi="['hash-wallet:walletType:add']"
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
          v-hasPermi="['hash-wallet:walletType:edit']"
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
          v-hasPermi="['hash-wallet:walletType:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hash-wallet:walletType:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table height="580" border  v-loading="loading" :data="walletTypeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="支付列别名称" align="center" prop="name" />
      <el-table-column label="列表编号" align="center" prop="payTypeNo" />
      <el-table-column label="状态" align="center" prop="isEnable">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.is_enable" :value="scope.row.isEnable" />
        </template>
      </el-table-column>
      <el-table-column label="排序字段 升序" align="center" prop="sort" />
      <el-table-column label="icon图片地址" align="center" prop="iconUrl" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" prop="updateTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['hash-wallet:walletType:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['hash-wallet:walletType:remove']"
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

    <!-- 添加或修改支付类型配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="支付列别名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入支付列别名称" />
        </el-form-item>
        <el-form-item label="列表编号" prop="payTypeNo">
          <el-input v-model="form.payTypeNo" placeholder="请输入列表编号" />
        </el-form-item>
        <el-form-item label="状态" prop="isEnable">
          <el-select v-model="form.isEnable" placeholder="请选择状态">
            <el-option
              v-for="dict in dict.type.is_enable"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序字段 升序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序字段 升序" />
        </el-form-item>
        <el-form-item label="icon图片地址" prop="iconUrl">
          <el-input v-model="form.iconUrl" placeholder="请输入icon图片地址" />
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
import { listWalletType, getWalletType, delWalletType, addWalletType, updateWalletType } from "@/api/hash-wallet/walletType";

export default {
  name: "WalletType",
  dicts: ['is_enable', 'is_fixed', 'pay_type_no'],
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
      // 支付类型配置表格数据
      walletTypeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        payTypeNo: null,
        isEnable: null,
        sort: null,
        iconUrl: null,
        createTime: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "支付列别名称不能为空", trigger: "blur" }
        ],
        payTypeNo: [
          { required: true, message: "列表编号不能为空", trigger: "blur" }
        ],
        isEnable: [
          { required: true, message: "状态, 1:启用, 2:禁用不能为空", trigger: "blur" }
        ],
        sort: [
          { required: true, message: "排序字段 升序不能为空", trigger: "blur" }
        ],
        iconUrl: [
          { required: true, message: "icon图片地址不能为空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ],
        updateTime: [
          { required: true, message: "更新时间不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询支付类型配置列表 */
    getList() {
      this.loading = true;
      listWalletType(this.queryParams).then(response => {
        this.walletTypeList = response.rows;
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
        payTypeNo: null,
        isEnable: null,
        sort: null,
        iconUrl: null,
        createTime: null,
        updateTime: null
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
      this.title = "添加支付类型配置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getWalletType(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改支付类型配置";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateWalletType(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addWalletType(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除支付类型配置编号为"' + ids + '"的数据项？').then(function () {
        return delWalletType(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('hash-wallet/walletType/export', {
        ...this.queryParams
      }, `walletType_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
