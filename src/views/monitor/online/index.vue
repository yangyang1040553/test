<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="108px">
      <el-form-item :label="$t('login_address')" prop="ipaddr">
        <el-input v-model="queryParams.ipaddr" :placeholder="$t('enter_login_address')" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item :label="$t('user_name')" prop="userName">
        <el-input v-model="queryParams.userName" :placeholder="$t('type_user_name')" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">{{ $t('search') }}</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">{{ $t('reset') }}</el-button>
      </el-form-item>

    </el-form>
    <el-table v-loading="loading" :data="list.slice((pageNum - 1) * pageSize, pageNum * pageSize)" style="width: 100%;">
      <el-table-column :label="$t('serial_number')" type="index" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{ (pageNum - 1) * pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('serial_number')" align="center" prop="tokenId" :show-overflow-tooltip="true" />
      <el-table-column :label="$t('login_name')" align="center" prop="userName" :show-overflow-tooltip="true" />
      <el-table-column :label="$t('department_name')" align="center" prop="deptName" />
      <el-table-column :label="$t('host')" align="center" prop="ipaddr" :show-overflow-tooltip="true" />
      <el-table-column :label="$t('login_location')" align="center" prop="loginLocation"
        :show-overflow-tooltip="true" />
      <el-table-column :label="$t('browser')" align="center" prop="browser" />
      <el-table-column :label="$t('operating_system')" align="center" prop="os" />
      <el-table-column :label="$t('login_time')" align="center" prop="loginTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.loginTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('operation')" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleForceLogout(scope.row)"
            v-hasPermi="['monitor:online:forceLogout']">{{ $t('retreat') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="pageNum" :limit.sync="pageSize" />
  </div>
</template>

<script>
import { list, forceLogout } from "@/api/monitor/online";

export default {
  name: "Online",
  data() {
    return {
      // ?????????
      loading: true,
      // ?????????
      total: 0,
      // ????????????
      list: [],
      pageNum: 1,
      pageSize: 10,
      // ????????????
      queryParams: {
        ipaddr: undefined,
        userName: undefined
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** ???????????????????????? */
    getList() {
      this.loading = true;
      list(this.queryParams).then(response => {
        this.list = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** ?????????????????? */
    handleQuery() {
      this.pageNum = 1;
      this.getList();
    },
    /** ?????????????????? */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** ?????????????????? */
    handleForceLogout(row) {
      this.$modal.confirm('???????????????????????????"' + row.userName + '"????????????').then(function () {
        return forceLogout(row.tokenId);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("????????????");
      }).catch(() => { });
    }
  }
};
</script>

