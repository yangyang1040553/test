<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="ip地址" prop="ip">
        <el-input
          v-model="queryParams.ip"
          placeholder="请输入ip地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="ip归属地" prop="ipAddr">
        <el-input
          v-model="queryParams.ipAddr"
          placeholder="请输入ip归属地 如深圳"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="注册次数" prop="regCount">
        <el-input
          v-model="queryParams.regCount"
          placeholder="请输入注册次数"
          clearable
          oninput="value=value.replace(/[^\d]/g,'')"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="IP是否禁用" prop="isDisable">
        <el-select
          v-model="queryParams.isDisable"
          placeholder="请选择是否禁用"
          clearable
          @keyup.enter.native="handleQuery"
        >
          <el-option
            v-for="dict in dict.type.is_disable"
            :key="dict.value"
            :label="dict.label"
            :value="parseInt(dict.value)"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['hash-statistical:register:add']"
        >新增</el-button>
      </el-col>-->
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['hash-statistical:register:edit']"
        >修改</el-button>
      </el-col>-->
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['hash-statistical:register:remove']"
        >删除</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hash-statistical:register:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="registerList"
      @sort-change="sortChange"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="IP地址" align="center" prop="ip">
        <template slot-scope="scope">
          <div class="global-text-blue" @click="goToUser(scope.row.ip)">{{scope.row.ip}}</div>
        </template>
      </el-table-column>
      <el-table-column label="IP的位置信息" align="center" prop="ipAddr" />
      <el-table-column label="注册次数" align="center" prop="regCount" sortable />
      <el-table-column label="是否禁用" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-switch
            style="display: block;height:32px;"
            v-model="scope.row.isDisable"
            active-color="#13ce66"
            inactive-color="#DCDFE6"
            active-text="是"
            inactive-text="否"
            :active-value="1"
            :inactive-value="0"
            @change="onSwitchChange(scope.row)"
          ></el-switch>
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

    <!-- 添加或修改用户ip注册次数对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="ip的位置信息 如-广东省 深圳" prop="ipAddr">
          <el-input v-model="form.ipAddr" placeholder="请输入ip的位置信息 如-广东省 深圳" />
        </el-form-item>
        <el-form-item label="注册次数" prop="regCount">
          <el-input v-model="form.regCount" placeholder="请输入注册次数" />
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
import { listRegister, getRegister, delRegister, addRegister, updateRegister } from "@/api/hash-statistical/register";

export default {
  name: "Register",
  dicts: ['is_disable'],
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
      // 用户ip注册次数表格数据
      registerList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        ip: null,
        ipAddr: null,
        regCount: null,
        orderByColumn: 'regCount',
        isAsc: 'desc',
        isDisable: null
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
    onSwitchChange(row) {
      updateRegister(row).then(response => {
        this.$modal.msgSuccess("修改成功");
        // this.open = false;
        this.getList();
      });
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
    goToUser(ip) {
      this.$router.push({ path: "/user/hashUserService", query: { ip: ip } })
    },
    /** 查询用户ip注册次数列表 */
    getList() {
      this.loading = true;
      listRegister(this.queryParams).then(response => {
        this.registerList = response.rows;
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
        ip: null,
        ipAddr: null,
        regCount: null,
        orderByColumn: 'regCount',
        isAsc: 'desc',
        isDisable: null
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
      this.ids = selection.map(item => item.ip)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加用户ip注册次数";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const ip = row.ip || this.ids
      getRegister(ip).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改用户ip注册次数";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.ip != null) {
            updateRegister(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addRegister(this.form).then(response => {
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
      const ips = row.ip || this.ids;
      this.$modal.confirm('是否确认删除用户ip注册次数编号为"' + ips + '"的数据项？').then(function () {
        return delRegister(ips);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('hash-statistical/register/export', {
        ...this.queryParams
      }, `register_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
