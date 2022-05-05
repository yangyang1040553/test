<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item :label="$t('system_module')" prop="title">
        <el-input v-model="queryParams.title" :placeholder="$t('enter_system_module')" clearable style="width: 240px;"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item :label="$t('operator')" prop="operName">
        <el-input v-model="queryParams.operName" :placeholder="$t('enter_operator')" clearable style="width: 240px;"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item :label="$t('type')" prop="businessType">
        <el-select v-model="queryParams.businessType" :placeholder="$t('operating_type')" clearable
          style="width: 240px">
          <el-option v-for="dict in dict.type.sys_oper_type" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('status')" prop="status">
        <el-select v-model="queryParams.status" :placeholder="$t('operating_status')" clearable style="width: 240px">
          <el-option v-for="dict in dict.type.sys_common_status" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('operating_time')">
        <el-date-picker v-model="dateRange" style="width: 240px" value-format="yyyy-MM-dd" type="daterange"
          range-separator="-" :start-placeholder="$t('start_date')" :end-placeholder="$t('end_date')"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">{{ $t('search') }}</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">{{ $t('reset') }}</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['monitor:operlog:remove']">{{ $t('delete') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" @click="handleClean"
          v-hasPermi="['monitor:operlog:remove']">{{ $t('clear') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['monitor:operlog:export']">{{ $t('export') }}</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table ref="tables" v-loading="loading" :data="list" @selection-change="handleSelectionChange"
      :default-sort="defaultSort" @sort-change="handleSortChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column :label="$t('log_number')" align="center" prop="operId" />
      <el-table-column :label="$t('system_moudel')" align="center" prop="title" />
      <el-table-column :label="$t('operating_type')" align="center" prop="businessType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_oper_type" :value="scope.row.businessType" />
        </template>
      </el-table-column>
      <el-table-column :label="$t('request_method')" align="center" prop="requestMethod" />
      <el-table-column :label="$t('operator')" align="center" prop="operName" width="100" :show-overflow-tooltip="true"
        sortable="custom" :sort-orders="['descending', 'ascending']" />
      <el-table-column :label="$t('operating_address')" align="center" prop="operIp" width="130"
        :show-overflow-tooltip="true" />
      <el-table-column :label="$t('operating_location')" align="center" prop="operLocation"
        :show-overflow-tooltip="true" />
      <el-table-column :label="$t('operating_status')" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_common_status" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column :label="$t('operating_date')" align="center" prop="operTime" sortable="custom"
        :sort-orders="['descending', 'ascending']" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.operTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('operation')" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-view" @click="handleView(scope.row, scope.index)"
            v-hasPermi="['monitor:operlog:query']">{{ $t('detail') }}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 操作日志详细 -->
    <el-dialog :title="$t('operating_log_detail')" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" label-width="160px" size="mini">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('operating_moudel')">{{ form.title }} / {{ typeFormat(form) }}</el-form-item>
            <el-form-item :label="$t('login_info')">{{ form.operName }} / {{ form.operIp }} / {{ form.operLocation }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('login_address')">{{ form.operUrl }}</el-form-item>
            <el-form-item :label="$t('login_method')">{{ form.requestMethod }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('method')">{{ form.method }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('request_paramater')">{{ form.operParam }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('back_paramater')">{{ form.jsonResult }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('operating_status')">
              <div v-if="form.status === 0">{{ $t('normal') }}</div>
              <div v-else-if="form.status === 1">{{ $t('fail') }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('operating_time')">{{ parseTime(form.operTime) }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('exception_information')" v-if="form.status === 1">{{ form.errorMsg }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">{{ $t('closed') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { list, delOperlog, cleanOperlog } from "@/api/monitor/operlog";

export default {
  name: "Operlog",
  dicts: ['sys_oper_type', 'sys_common_status'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      list: [],
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 默认排序
      defaultSort: { prop: 'operTime', order: 'descending' },
      // 表单参数
      form: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        operName: undefined,
        businessType: undefined,
        status: undefined
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询登录日志 */
    getList() {
      this.loading = true;
      list(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.list = response.rows;
        this.total = response.total;
        this.loading = false;
      }
      );
    },
    // 操作日志类型字典翻译
    typeFormat(row, column) {
      return this.selectDictLabel(this.dict.type.sys_oper_type, row.businessType);
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.$refs.tables.sort(this.defaultSort.prop, this.defaultSort.order)
      this.handleQuery();
    },
    /** 多选框选中数据 */
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.operId)
      this.multiple = !selection.length
    },
    /** 排序触发事件 */
    handleSortChange(column, prop, order) {
      this.queryParams.orderByColumn = column.prop;
      this.queryParams.isAsc = column.order;
      this.getList();
    },
    /** 详细按钮操作 */
    handleView(row) {
      this.open = true;
      this.form = row;
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const operIds = row.operId || this.ids;
      this.$modal.confirm('是否确认删除日志编号为"' + operIds + '"的数据项？').then(function () {
        return delOperlog(operIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 清空按钮操作 */
    handleClean() {
      this.$modal.confirm('是否确认清空所有操作日志数据项？').then(function () {
        return cleanOperlog();
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("清空成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('monitor/operlog/export', {
        ...this.queryParams
      }, `operlog_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>

