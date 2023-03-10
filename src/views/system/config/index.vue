<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="120px">
      <el-form-item :label="$t('parameter_name')" prop="configName">
        <el-input v-model="queryParams.configName" :placeholder="$t('enter_parameter_name')" clearable
          style="width: 240px" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item :label="$t('parameter_key')" prop="configKey">
        <el-input v-model="queryParams.configKey" :placeholder="$t('enter_parameter_key')" clearable
          style="width: 240px" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item :label="$t('system_built_in')" prop="configType">
        <el-select v-model="queryParams.configType" :placeholder="$t('system_built_in')" clearable>
          <el-option v-for="dict in dict.type.sys_yes_no" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('create_time')">
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
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['system:config:add']">{{ $t('new') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['system:config:edit']">{{ $t('edit') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['system:config:remove']">{{ $t('delete') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['system:config:export']">{{ $t('export') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-refresh" size="mini" @click="handleRefreshCache"
          v-hasPermi="['system:config:remove']">{{ $t('flush_cache') }}</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="configList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column :label="$t('parameter_primary_key')" align="center" prop="configId" />
      <el-table-column :label="$t('parameter_name')" align="center" prop="configName" :show-overflow-tooltip="true" />
      <el-table-column :label="$t('parameter_key')" align="center" prop="configKey" :show-overflow-tooltip="true" />
      <el-table-column :label="$t('parameter_value')" align="center" prop="configValue" />
      <el-table-column :label="$t('system_built_in')" align="center" prop="configType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_yes_no" :value="scope.row.configType" />
        </template>
      </el-table-column>
      <el-table-column :label="$t('remark')" align="center" prop="remark" :show-overflow-tooltip="true" />
      <el-table-column :label="$t('create_time')" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('operation')" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:config:edit']">{{ $t('edit') }}</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:config:remove']">{{ $t('delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- ???????????????????????????????????? -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-form-item :label="$t('parameter_name')" prop="configName">
          <el-input v-model="form.configName" :placeholder="$t('enter_parameter_name')" />
        </el-form-item>
        <el-form-item :label="$t('parameter_key')" prop="configKey">
          <el-input v-model="form.configKey" :placeholder="$t('enter_parameter_key')" />
        </el-form-item>
        <el-form-item :label="$t('parameter_value')" prop="configValue">
          <el-input v-model="form.configValue" :placeholder="$t('enter_parameter_value')" />
        </el-form-item>
        <el-form-item :label="$t('system_built_in')" prop="configType">
          <el-radio-group v-model="form.configType">
            <el-radio v-for="dict in dict.type.sys_yes_no" :key="dict.value" :label="dict.value">{{ dict.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('remark')" prop="remark">
          <el-input v-model="form.remark" type="textarea" :placeholder="$t('type_content')" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">{{ $t('sure') }}</el-button>
        <el-button @click="cancel">{{ $t('cancel') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listConfig, getConfig, delConfig, addConfig, updateConfig, refreshCache } from "@/api/system/config";
import { getKey } from "@/lang";

export default {
  name: "Config",
  dicts: ['sys_yes_no'],
  data() {
    return {
      // ?????????
      loading: true,
      // ????????????
      ids: [],
      // ???????????????
      single: true,
      // ???????????????
      multiple: true,
      // ??????????????????
      showSearch: true,
      // ?????????
      total: 0,
      // ??????????????????
      configList: [],
      // ???????????????
      title: "",
      // ?????????????????????
      open: false,
      // ????????????
      dateRange: [],
      // ????????????
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        configName: undefined,
        configKey: undefined,
        configType: undefined
      },
      // ????????????
      form: {},
      // ????????????
      rules: {
        configName: [
          { required: true, message: "????????????????????????", trigger: "blur" }
        ],
        configKey: [
          { required: true, message: "????????????????????????", trigger: "blur" }
        ],
        configValue: [
          { required: true, message: "????????????????????????", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** ?????????????????? */
    getList() {
      this.loading = true;
      listConfig(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.configList = response.rows;
        this.total = response.total;
        this.loading = false;
      }
      );
    },
    // ????????????
    cancel() {
      this.open = false;
      this.reset();
    },
    // ????????????
    reset() {
      this.form = {
        configId: undefined,
        configName: undefined,
        configKey: undefined,
        configValue: undefined,
        configType: "Y",
        remark: undefined
      };
      this.resetForm("form");
    },
    /** ?????????????????? */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** ?????????????????? */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** ?????????????????? */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = getKey('add_parameter');
    },
    // ?????????????????????
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.configId)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** ?????????????????? */
    handleUpdate(row) {
      this.reset();
      const configId = row.configId || this.ids
      getConfig(configId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "????????????";
      });
    },
    /** ???????????? */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.configId != undefined) {
            updateConfig(this.form).then(response => {
              this.$modal.msgSuccess("????????????");
              this.open = false;
              this.getList();
            });
          } else {
            addConfig(this.form).then(response => {
              this.$modal.msgSuccess("????????????");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** ?????????????????? */
    handleDelete(row) {
      const configIds = row.configId || this.ids;
      this.$modal.confirm('?????????????????????????????????"' + configIds + '"???????????????').then(function () {
        return delConfig(configIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("????????????");
      }).catch(() => { });
    },
    /** ?????????????????? */
    handleExport() {
      this.download('system/config/export', {
        ...this.queryParams
      }, `config_${new Date().getTime()}.xlsx`)
    },
    /** ???????????????????????? */
    handleRefreshCache() {
      refreshCache().then(() => {
        this.$modal.msgSuccess("????????????");
      });
    }
  }
};
</script>
