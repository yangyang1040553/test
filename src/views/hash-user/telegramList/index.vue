<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <!-- <el-form-item label="id" prop="id">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <el-form-item label="飞机账户" prop="tgAccount">
        <el-input
          v-model="queryParams.tgAccount"
          placeholder="请输入tg账户"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="tg唯一id" prop="tgId">
        <el-input
          v-model="queryParams.tgId"
          placeholder="请输入tg唯一id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <el-form-item label="飞机昵称" prop="tgName">
        <el-input
          v-model="queryParams.tgName"
          placeholder="请输入tg昵称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="应用id" prop="tgAppId">
        <el-input
          v-model="queryParams.tgAppId"
          placeholder="请输入应用id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <el-form-item label="飞机类型" prop="tgType">
        <el-select v-model="queryParams.tgType" placeholder="请选择tg类型" clearable>
          <el-option
            v-for="dict in dict.type.tg_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="飞机群主" prop="tgGourp">
        <el-input
          v-model="queryParams.tgGourp"
          placeholder="请输入tg群主"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="玩家id" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入玩家id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option
            v-for="dict in dict.type.tg_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="时间" prop="createTime">
        <el-date-picker
          clearable
          v-model="queryParams.createTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择创建时间"
        ></el-date-picker>
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
          v-hasPermi="['hash-user:telegramList:add']"
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
          v-hasPermi="['hash-user:telegramList:edit']"
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
          v-hasPermi="['hash-user:telegramList:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hash-user:telegramList:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="telegramListList"
      @sort-change="sortChange"
      @selection-change="handleSelectionChange"
      height="600"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="飞机账户" align="center" prop="tgAccount" sortable />
      <el-table-column label="飞机ID" align="center" prop="tgId" sortable />
      <el-table-column label="飞机昵称" align="center" prop="tgName" sortable />
      <el-table-column label="APPID" align="center" prop="tgAppId" sortable />
      <el-table-column label="APPKEY" align="center" prop="tg_app_key" sortable />
      <el-table-column label="RANDOMNO" align="center" prop="tg_random_no" sortable />
      <el-table-column label="飞机类型" align="center" prop="tgType" sortable>
        <template slot-scope="scope">
          <dict-tag
            :class="scope.row.tgType!='master'?'global-text-blue':'global-text-red'"
            :options="dict.type.tg_type"
            :value="scope.row.tgType"
          />
        </template>
      </el-table-column>
      <el-table-column label="飞机群主" align="center" prop="tgGourp" sortable />
      <el-table-column label="玩家id" align="center" prop="userId" sortable>
        <template slot-scope="scope">
          <div
            class="global-text-blue"
            @click="openUserDetail(scope.row.userId)"
          >{{scope.row.userId}}</div>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" sortable>
        <template slot-scope="scope">
          <dict-tag
            :class="scope.row.status?'global-text-green':'global-text-red'"
            :options="dict.type.tg_status"
            :value="scope.row.status"
          />
        </template>
      </el-table-column>
      <el-table-column label="时间" align="center" prop="createTime" width="180" sortable />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['hash-user:telegramList:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['hash-user:telegramList:remove']"
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

    <!-- 添加或修改用户飞机对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="130px">
        <el-form-item label="飞机账户" prop="tgAccount">
          <el-input v-model="form.tgAccount" placeholder="请输入tg账户" />
        </el-form-item>
        <!-- <el-form-item label="飞机id" prop="tgId">
          <el-input v-model="form.tgId" placeholder="请输入tg唯一id" />
        </el-form-item>-->
        <el-form-item label="飞机昵称" prop="tgName">
          <el-input v-model="form.tgName" placeholder="请输入tg昵称" />
        </el-form-item>
        <el-form-item label="飞机APPID" prop="tgAppId">
          <el-input v-model="form.tgAppId" placeholder="请输入应用id" />
        </el-form-item>
        <!-- <el-form-item label="飞机群主" prop="tgGourp">
          <el-input v-model="form.tgGourp" placeholder="请输入tg群主" />
        </el-form-item>
        <el-form-item label="玩家id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入玩家id" />
        </el-form-item>-->
        <el-form-item label="飞机APPKEY" prop="tg_app_key">
          <el-input v-model="form.tg_app_key" placeholder="请输入APPKEY" />
        </el-form-item>
        <el-form-item label="飞机TOKEN" prop="rob_token">
          <el-input v-model="form.rob_token" placeholder="请输入TOKEN" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择是否禁用" clearable>
            <el-option
              v-for="dict in useStatus"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="tg_random_no" prop="tg_random_no">
          <el-input v-model="form.userId" placeholder="请输入RANDOMNO" />
        </el-form-item>-->
        <!-- <el-form-item label="飞机类型" prop="tgType">
          <el-select v-model="form.tgType" placeholder="请选择飞机类型">
            <el-option
              v-for="dict in dict.type.tg_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>-->
        <!-- <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option
              v-for="dict in dict.type.tg_status"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <UserInfoDialog v-if="openUser" :open="openUser" :id="userId" @close="openUser=false" />
  </div>
</template>

<script>
import { listTelegramList, getTelegramList, delTelegramList, addTelegramList, updateTelegramList } from "@/api/hash-user/telegramList";
import UserInfoDialog from "../../components/dialog/UserInfoDialog.vue";
export default {
  name: "TelegramList",
  dicts: ['tg_status', 'tg_type'],
  components: {
    UserInfoDialog
  },
  data() {
    return {
      openUser: false,
      userId: null,
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
      // 用户飞机表格数据
      telegramListList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      useStatus: [{ label: '启用', value: 1 }, { label: '禁用', value: 0 }],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: null,
        tgAccount: null,
        tgId: null,
        tgName: null,
        tgAppId: null,
        tgType: 'user',
        tgGourp: null,
        userId: null,
        status: null,
        createTime: null,
        orderByColumn: 'createTime',
        isAsc: 'desc'
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        tgAccount: [{ required: true, message: 'tg账户不能为空', trigger: 'blur' }],
        tgId: [{ required: true, message: 'tg唯一id不能为空', trigger: 'blur' }],
        tgName: [{ required: true, message: 'tg昵称不能为空', trigger: 'blur' }],
        tgAppId: [{ required: true, message: '应用id不能为空', trigger: 'blur' }],
        tgType: [{ required: true, message: 'tg类型 master user不能为空', trigger: 'change' }],
        tgGourp: [{ required: true, message: 'tg群主不能为空', trigger: 'blur' }],
        userId: [{ required: true, message: '玩家id不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '状态不能为空', trigger: 'change' }],
        tg_app_id: [{ required: true, message: 'appid不能为空', trigger: 'change' }],
        tg_app_key: [{ required: true, message: 'appkey不能为空', trigger: 'change' }],
        rob_token: [{ required: true, message: 'token不能为空', trigger: 'change' }],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    openUserDetail(userId) {
      this.openUser = true;
      this.userId = userId;
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
    /** 查询用户飞机列表 */
    getList() {
      this.loading = true;
      listTelegramList(this.queryParams).then(response => {
        this.telegramListList = response.rows;
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
        tgAccount: null,
        tgId: null,
        tgName: null,
        tgAppId: null,
        tgType: 'user',
        tgGourp: null,
        userId: null,
        status: null,
        createTime: null,
        updateTime: null,
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
      this.title = "添加用户飞机";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getTelegramList(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改用户飞机";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateTelegramList(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTelegramList(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除用户飞机编号为"' + ids + '"的数据项？').then(function () {
        return delTelegramList(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('hash-user/telegramList/export', {
        ...this.queryParams
      }, `telegramList_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
