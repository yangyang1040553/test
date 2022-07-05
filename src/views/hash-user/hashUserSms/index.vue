<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <!-- <el-form-item label="玩家id" prop="userId">
        <el-input v-model="queryParams.userId" placeholder="请输入玩家id" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>-->
      <el-form-item label="国际区号" prop="areaCode">
        <el-input
          v-model="queryParams.areaCode"
          placeholder="请输入国际区号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入手机号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="ok">
        <el-select v-model="queryParams.ok" placeholder="请选择是否成功" clearable>
          <el-option
            v-for="dict in dict.type.sms_status"
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
      <!-- <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['hash-user:hashUserSms:add']">新增</el-button>
      </el-col>-->
      <!-- <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['hash-user:hashUserSms:edit']">修改</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['hash-user:hashUserSms:remove']"
        >删除</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hash-user:hashUserSms:export']"
        >导出</el-button>
      </el-col> -->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="hashUserSmsList"
      @sort-change="sortChange"
      @selection-change="handleSelectionChange"
      height="600"
      :row-class-name="tableRowClassName"
    >
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="玩家id" align="center" prop="userId" /> -->
      <el-table-column label="国际区号" align="center" prop="areaCode" />
      <el-table-column label="手机号" align="center" prop="phone" />
      <el-table-column label="验证码" align="center" prop="checkCode" />
      <el-table-column label="IP" align="center" prop="ip" />
      <el-table-column label="时间" align="center" prop="createTime" sortable />
      <el-table-column label="状态" align="center" prop="ok">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sms_status" :value="scope.row.ok" />
        </template>
      </el-table-column>
      <el-table-column label="返回数据" align="center" prop="responseData" width="180">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <div class="hover-div">{{ scope.row.responseData }}</div>
            <div class="text-content name-wrapper" slot="reference">{{ scope.row.responseData }}</div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!-- <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
          v-hasPermi="['hash-user:hashUserSms:edit']">修改</el-button>-->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['hash-user:hashUserSms:remove']"
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

    <!-- 添加或修改用户短信功能对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="唯一id" prop="id">
          <el-input v-model="form.id" placeholder="请输入唯一id" />
        </el-form-item>
        <el-form-item label="玩家id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入玩家id" />
        </el-form-item>
        <el-form-item label="国际区号" prop="areaCode">
          <el-input v-model="form.areaCode" placeholder="请输入国际区号" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="是否成功" prop="ok">
          <el-select v-model="form.ok" placeholder="请选择是否成功">
            <el-option
              v-for="dict in dict.type.sms_status"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="返回数据" prop="responseData">
          <el-input v-model="form.responseData" placeholder="请输入返回数据" />
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
import { listHashUserSms, getHashUserSms, delHashUserSms, addHashUserSms, updateHashUserSms } from "@/api/hash-user/hashUserSms";

export default {
  name: "HashUserSms",
  dicts: ['sms_status'],
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
      // 用户短信功能表格数据
      hashUserSmsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        areaCode: null,
        phone: null,
        ok: null,
        orderByColumn: 'createTime',
        isAsc: 'desc'
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
    tableRowClassName({
      row,
      rowIndex,
    }) {
      if (row.ok == 0) {
        return 'warning-row'
      }
      return ''
    },
    sortChange(val) {
      if (val.order && val.order == 'descending') {
        this.queryParams.isAsc = 'desc'
      } else {
        this.queryParams.isAsc = 'asc'
      }
      this.queryParams.orderByColumn = val.prop && val.prop
      this.getList()
    },
    /** 查询用户短信功能列表 */
    getList() {
      this.loading = true;
      listHashUserSms(this.queryParams).then(response => {
        this.hashUserSmsList = response.rows;
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
        userId: null,
        areaCode: null,
        phone: null,
        ok: null,
        responseData: null,
        createTime: null,
        orderByColumn: 'createTime',
        isAsc: 'desc'
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
      this.title = "添加用户短信功能";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getHashUserSms(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改用户短信功能";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateHashUserSms(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addHashUserSms(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除用户短信功能编号为"' + ids + '"的数据项？').then(function () {
        return delHashUserSms(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('hash-user/hashUserSms/export', {
        ...this.queryParams
      }, `hashUserSms_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
<style lang="scss" scoped>
.text-content {
  max-height: 50px !important;
  overflow: hidden;
  width: 180px;
}

.hover-div {
  max-width: 300px;
}
</style>