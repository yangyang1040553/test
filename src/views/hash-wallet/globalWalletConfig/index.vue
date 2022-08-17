<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="商户号" prop="merchantNo">
        <el-input
          v-model="queryParams.merchantNo"
          placeholder="请输入商户号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="公钥" prop="publicKey">
        <el-input
          v-model="queryParams.publicKey"
          placeholder="请输入公钥"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="私钥" prop="privateKey">
        <el-input
          v-model="queryParams.privateKey"
          placeholder="请输入私钥"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="trx转usdt比例" prop="trxTransUsdtScale">
        <el-input
          v-model="queryParams.trxTransUsdtScale"
          placeholder="请输入trx转usdt比例"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="usdt转trx比例" prop="usdtTransTrxScale">
        <el-input
          v-model="queryParams.usdtTransTrxScale"
          placeholder="请输入usdt转trx比例"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <!-- <el-form-item label="矿工费比例" prop="minerScala">
        <el-input
          v-model="queryParams.minerScala"
          placeholder="请输入矿工费比例"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
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
          v-hasPermi="['hash-wallet:globalWalletConfig:add']"
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
          v-hasPermi="['hash-wallet:globalWalletConfig:edit']"
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
          v-hasPermi="['hash-wallet:globalWalletConfig:remove']"
        >删除</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hash-wallet:globalWalletConfig:export']"
        >导出</el-button>
      </el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="globalWalletConfigList"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
      height="600"
      border
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="商户号" align="center" prop="merchantNo" />
      <el-table-column label="公钥" align="center" prop="publicKey" />
      <el-table-column label="私钥" align="center" prop="privateKey" />
      <el-table-column label="USDT免审核金额" align="center" prop="usdt_free_check" width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.usdt_free_check || "-" }}</span>
        </template>
      </el-table-column>

      <el-table-column label="TRX免审核金额" align="center" prop="trx_free_check" width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.trx_free_check || "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="矿工费比例" align="center" prop="minerScala" sortable width="130" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.createTime || "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建者" align="center" prop="createBy" />
      <el-table-column label="更新时间" align="center" prop="updateTime" width="180" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime || "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新者" align="center" prop="updateBy">
        <template slot-scope="scope">
          <span>{{ scope.row.updateBy || "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['hash-wallet:globalWalletConfig:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['hash-wallet:globalWalletConfig:remove']"
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

    <!-- 添加或修改钱包全局配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-form-item label="商户号" prop="merchantNo">
          <el-input v-model="form.merchantNo" placeholder="请输入商户号" />
        </el-form-item>
        <el-form-item label="公钥" prop="publicKey">
          <el-input v-model="form.publicKey" placeholder="请输入公钥" />
        </el-form-item>
        <el-form-item label="私钥" prop="privateKey">
          <el-input v-model="form.privateKey" placeholder="请输入私钥" />
        </el-form-item>
        <el-form-item label="USDT免审核金额" prop="usdt_free_check">
          <el-input
            v-model="form.usdt_free_check"
            oninput="value=value.replace(/[^\d\.]/g,'')"
            placeholder="请输入金额"
          />
        </el-form-item>
        <el-form-item label="TRX免审核金额" prop="trx_free_check">
          <el-input
            v-model="form.trx_free_check"
            oninput="value=value.replace(/[^\d\.]/g,'')"
            placeholder="请输入金额"
          />
        </el-form-item>
        <!-- <el-form-item label="trx转usdt比例" prop="trxToUsdt">
          <el-row>
            <el-col :span="12" class="card-box">
              <el-input v-model="form.trxToUsdt.sourceScale" placeholder="请输入trx转usdt比例" />
            </el-col>
            <el-col :span="1">
              <div class="space">:</div>
            </el-col>
            <el-col :span="11" class="card-box">
              <el-input v-model="form.trxToUsdt.toScale" placeholder="请输入trx转usdt比例" />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="usdt转trx比例" prop="usdtToTrx">
          <el-row>
            <el-col :span="12" class="card-box">
              <el-input v-model="form.usdtToTrx.sourceScale" placeholder="请输入usdt转trx比例" />
            </el-col>
            <el-col :span="1">
              <div class="space">:</div>
            </el-col>
            <el-col :span="11" class="card-box">
              <el-input v-model="form.usdtToTrx.toScale" placeholder="请输入usdt转trx比例" />
            </el-col>
          </el-row>
        </el-form-item>-->
        <el-form-item label="矿工费比例" prop="minerScala">
          <el-input
            v-model="form.minerScala"
            oninput="value=value.replace(/[^\d\.]/g,'')"
            placeholder="请输入矿工费比例"
          />
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
import { listGlobalWalletConfig, getGlobalWalletConfig, delGlobalWalletConfig, addGlobalWalletConfig, updateGlobalWalletConfig } from "@/api/hash-wallet/globalWalletConfig";

export default {
  name: "GlobalWalletConfig",
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
      // 钱包全局配置表格数据
      globalWalletConfigList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        merchantNo: null,
        publicKey: null,
        privateKey: null,
        // trxTransUsdtScale: null,
        // usdtTransTrxScale: null,
        // minerScala: null,
      },
      // 表单参数
      form: {
        // trxToUsdt: {
        //   sourceScale: 0,
        //   toScale: 0
        // },
        // usdtToTrx: {
        //   sourceScale: 0,
        //   toScale: 0
        // }
      },
      // 表单校验
      rules: {
        merchantNo: [
          { required: true, message: "商户号不能为空", trigger: "blur" }
        ],
        publicKey: [
          { required: true, message: "公钥不能为空", trigger: "blur" }
        ],
        privateKey: [
          { required: true, message: "私钥不能为空", trigger: "blur" }
        ],
        trxTransUsdtScale: [
          { required: true, message: "trx转usdt比例不能为空", trigger: "blur" }
        ],
        usdtTransTrxScale: [
          { required: true, message: "usdt转trx比例不能为空", trigger: "blur" }
        ],
        minerScala: [
          { required: true, message: "矿工费比例不能为空", trigger: "blur" }
        ],
        usdt_free_check: [
          { required: true, message: "USDT免审核金额不能为空", trigger: "blur" }
        ],
        trx_free_check: [
          { required: true, message: "TRX免审核金额不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    sortChange(val) {
      //console.log(val)
      if (val.order && val.order == 'descending') {
        this.queryParams.isAsc = 'desc'
      } else {
        this.queryParams.isAsc = 'asc'
      }
      this.queryParams.orderByColumn = val.prop && val.prop
      //console.log(this.queryParams)
      this.getList()
    },
    /** 查询钱包全局配置列表 */
    getList() {
      this.loading = true;
      listGlobalWalletConfig(this.queryParams).then(response => {
        this.globalWalletConfigList = response.rows;
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
        merchantNo: null,
        publicKey: null,
        privateKey: null,
        trxToUsdt: {
          sourceScale: 0,
          toScale: 0
        },
        usdtToTrx: {
          sourceScale: 0,
          toScale: 0
        },
        minerScala: null,
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
      this.title = "添加钱包全局配置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getGlobalWalletConfig(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改钱包全局配置";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          // this.form.usdtTransTrxScale = JSON.stringify(this.form.usdtToTrx)
          // this.form.trxTransUsdtScale = JSON.stringify(this.form.trxToUsdt)
          if (this.form.id != null) {
            updateGlobalWalletConfig(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addGlobalWalletConfig(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除钱包全局配置编号为"' + ids + '"的数据项？').then(function () {
        return delGlobalWalletConfig(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('hash-wallet/globalWalletConfig/export', {
        ...this.queryParams
      }, `globalWalletConfig_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
<style  lang="scss" scoped>
.space {
  width: 100%;
  margin: 0 auto;
  text-align: center;
  font-weight: bold;
}
</style>
