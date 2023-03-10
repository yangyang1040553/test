<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="78px">
      <el-form-item :label="$t('dictionary_name')" prop="dictName">
        <el-input v-model="queryParams.dictName" :placeholder="$t('enter_dictionary_name')" clearable style="width: 240px" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item :label="$t('dictionary_type')" prop="dictType">
        <el-input v-model="queryParams.dictType" :placeholder="$t('enter_dictionary_type')" clearable style="width: 240px" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item :label="$t('status')" prop="status">
        <el-select v-model="queryParams.status" :placeholder="$t('dictionary_status')" clearable style="width: 240px">
          <el-option v-for="dict in dict.type.sys_normal_disable" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('create_time')">
        <el-date-picker
          v-model="dateRange"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          :start-placeholder="$t('start_date')"
          :end-placeholder="$t('end_date')"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">{{ $t('search') }}</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">{{ $t('reset') }}</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['system:dict:add']">{{ $t('new') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['system:dict:edit']">{{ $t('edit') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['system:dict:remove']">
          {{ $t('delete') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['system:dict:export']">{{ $t('export') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-refresh" size="mini" @click="handleRefreshCache" v-hasPermi="['system:dict:remove']">{{ $t('flush_cache') }}</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="typeList" @sort-change="sortChange" @selection-change="handleSelectionChange" height="600">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column :label="$t('dictionary_number')" align="center" prop="dictId" />
      <el-table-column :label="$t('dictionary_name')" align="center" prop="dictName" :show-overflow-tooltip="true" />
      <el-table-column :label="$t('dictionary_type')" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <router-link :to="'/system/dict-data/index/' + scope.row.dictId" class="link-type">
            <span>{{ scope.row.dictType }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column :label="$t('status')" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column :label="$t('remark')" align="center" prop="remark" :show-overflow-tooltip="true" />
      <el-table-column :label="$t('create_time')" align="center" prop="createTime" width="180" sortable>
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('operation')" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:dict:edit']">{{ $t('edit') }}</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['system:dict:remove']">{{ $t('delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- ???????????????????????????????????? -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-form-item :label="$t('dictionary_name')" prop="dictName"><el-input v-model="form.dictName" :placeholder="$t('enter_dictionary_name')" /></el-form-item>
        <el-form-item :label="$t('dictionary_type')" prop="dictType"><el-input v-model="form.dictType" :placeholder="$t('enter_dictionary_type')" /></el-form-item>
        <el-form-item :label="$t('status')" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio v-for="dict in dict.type.sys_normal_disable" :key="dict.value" :label="dict.value">{{ dict.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('remark')" prop="remark"><el-input v-model="form.remark" type="textarea" :placeholder="$t('type_content')"></el-input></el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">{{ $t('sure') }}</el-button>
        <el-button @click="cancel">{{ $t('cancel') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listType, getType, delType, addType, updateType, refreshCache } from '@/api/system/dict/type'
import { getKey } from '@/lang'

export default {
  name: 'Dict',
  dicts: ['sys_normal_disable'],
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
      typeList: [],
      // ???????????????
      title: '',
      // ?????????????????????
      open: false,
      // ????????????
      dateRange: [],
      // ????????????
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        dictName: undefined,
        dictType: undefined,
        status: undefined,
        orderByColumn: 'createTime',
        isAsc: 'desc'
      },
      // ????????????
      form: {},
      // ????????????
      rules: {
        dictName: [{ required: true, message: '????????????????????????', trigger: 'blur' }],
        dictType: [{ required: true, message: '????????????????????????', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
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
    /** ???????????????????????? */
    getList() {
      this.loading = true
      listType(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.typeList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // ????????????
    cancel() {
      this.open = false
      this.reset()
    },
    // ????????????
    reset() {
      this.form = {
        dictId: undefined,
        dictName: undefined,
        dictType: undefined,
        status: '0',
        remark: undefined,
        orderByColumn: 'createTime',
        isAsc: 'desc'
      }
      this.resetForm('form')
    },
    /** ?????????????????? */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** ?????????????????? */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** ?????????????????? */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = getKey('add_dictionary_type')
    },
    // ?????????????????????
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.dictId)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** ?????????????????? */
    handleUpdate(row) {
      this.reset()
      const dictId = row.dictId || this.ids
      getType(dictId).then(response => {
        this.form = response.data
        this.open = true
        this.title = '??????????????????'
      })
    },
    /** ???????????? */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.dictId != undefined) {
            updateType(this.form).then(response => {
              this.$modal.msgSuccess('????????????')
              this.open = false
              this.getList()
            })
          } else {
            addType(this.form).then(response => {
              this.$modal.msgSuccess('????????????')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** ?????????????????? */
    handleDelete(row) {
      const dictIds = row.dictId || this.ids
      this.$modal
        .confirm('?????????????????????????????????"' + dictIds + '"???????????????')
        .then(function() {
          return delType(dictIds)
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess('????????????')
        })
        .catch(() => {})
    },
    /** ?????????????????? */
    handleExport() {
      this.download(
        'system/dict/type/export',
        {
          ...this.queryParams
        },
        `type_${new Date().getTime()}.xlsx`
      )
    },
    /** ???????????????????????? */
    handleRefreshCache() {
      refreshCache().then(() => {
        this.$modal.msgSuccess('????????????')
      })
    }
  }
}
</script>
