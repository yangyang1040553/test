<template>
  <div class="app-container">
    <!-- <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>-->

    <!-- <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['hash-user:hashUserConfig:add']"
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
          v-hasPermi="['hash-user:hashUserConfig:edit']"
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
          v-hasPermi="['hash-user:hashUserConfig:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hash-user:hashUserConfig:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>-->

    <!-- <el-table
      v-loading="loading"
      :data="hashUserConfigList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="唯一ID" align="center" prop="id" width="160" />
      <el-table-column label="最新的主页地址" align="center" prop="newDomainAddr" width="160" />
      <el-table-column label="在线客服地址" align="center" prop="onlineServiceAddr" width="160" />
      <el-table-column label="官方群组地址" align="center" prop="groupAddr" width="160" />
      <el-table-column label="用户注册协议地址" align="center" prop="regProtocolAddr" width="160" />
      <el-table-column label="推广链接地址" align="center" prop="promoteAddr" width="160" />
      <el-table-column label="ios下载地址" align="center" prop="iosDownloadAddr" width="160" />
      <el-table-column label="ios版本号" align="center" prop="iosVersion" />
      <el-table-column label="安卓下载地址" align="center" prop="androidDownloadAddr" width="160" />
      <el-table-column label="安卓版本号" align="center" prop="androidVersion" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" prop="updateTime" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新者" align="center" prop="updateBy" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['hash-user:hashUserConfig:edit']"
          >修改</el-button>
        </template>
      </el-table-column>
    </el-table>-->

    <el-form ref="form" :model="form" :rules="rules" label-width="140px" class="my-form">
      <el-card class="box-card">
        <el-form-item label="最新的主页地址" prop="newDomainAddr">
          <el-input v-model="form.newDomainAddr" placeholder="请输入最新的主页地址" />
        </el-form-item>
        <el-form-item label="在线客服地址" prop="onlineServiceAddr">
          <el-input v-model="form.onlineServiceAddr" placeholder="请输入在线客服地址" />
        </el-form-item>
        <el-form-item label="是否官方客服地址" prop="isSelfOnline">
          <el-switch
            v-model="form.isSelfOnline"
            active-color="#13ce66"
            inactive-color="#34B7EA"
            active-text="是"
            :active-value="1"
            :inactive-value="0"
            inactive-text="否"
          ></el-switch>
        </el-form-item>
        <el-form-item label="是否限制设置注册" prop="reg_limit">
          <el-switch
            v-model="form.reg_limit"
            active-color="#13ce66"
            inactive-color="#34B7EA"
            active-text="是"
            active-value="1"
            inactive-value="0"
            inactive-text="否"
          ></el-switch>
        </el-form-item>
        <el-form-item label="官方群组地址" prop="groupAddr">
          <el-input v-model="form.groupAddr" placeholder="请输入官方群组地址" />
        </el-form-item>
        <el-form-item label="用户注册协议地址" prop="regProtocolAddr">
          <el-input v-model="form.regProtocolAddr" placeholder="请输入用户注册协议地址" />
        </el-form-item>
        <el-form-item label="推广链接地址" prop="promoteAddr">
          <el-input v-model="form.promoteAddr" placeholder="请输入推广链接地址" />
        </el-form-item>
        <el-form-item label="区块链地址" prop="blockChainAddr">
          <el-input v-model="form.blockChainAddr" placeholder="请输入区块链地址" />
        </el-form-item>
        <el-form-item label="web端地址" prop="webAddr">
          <el-input v-model="form.webAddr" placeholder="请输入web端地址" />
        </el-form-item>
        <el-form-item label="ios下载地址" prop="iosDownloadAddr">
          <el-input v-model="form.iosDownloadAddr" placeholder="请输入ios下载地址" />
          <div style="color:red;">多个地址 以 英文版 分号 ; 区分</div>
        </el-form-item>
        <el-form-item style="margin-top:40px;" label="安卓下载地址" prop="androidDownloadAddr">
          <el-input v-model="form.androidDownloadAddr" placeholder="请输入安卓下载地址" />
        </el-form-item>
        <el-form-item style="margin-top:40px;" label="中间下载页地址" prop="h5_qr_addr">
          <el-input v-model="form.h5_qr_addr" placeholder="请输入中间下载页地址" />
        </el-form-item>
        <el-form-item style="margin-top:40px;" label="欢迎语" prop="welecome_txt">
          <el-input v-model="form.welecome_txt" type="textarea" placeholder="请输入欢迎语" />
        </el-form-item>
        <el-form-item label="是否开启广告" style="margin-top:40px;" prop="open_gg">
          <el-switch
            v-model="form.open_gg"
            active-color="#13ce66"
            inactive-color="#34B7EA"
            active-text="是"
            :active-value="1"
            :inactive-value="0"
            inactive-text="否"
          ></el-switch>
        </el-form-item>
        <el-form-item
          style="margin-top:40px;height:100px;"
          label="广告地址"
          v-if="form.open_gg==1"
          prop="gg_addr"
        >
          <UploadVue :index="1" :url="form.gg_addr" @setImageUrl="setImageUrl" />
        </el-form-item>
      </el-card>
      <!-- <el-card class="box-card">
        <el-form-item label="ios下载地址" prop="iosDownloadAddr">
          <el-input v-model="form.iosDownloadAddr" placeholder="请输入ios下载地址" />
        </el-form-item>
        <el-form-item label="ios版本号" prop="iosVersion">
          <el-input
            v-model="form.iosVersion"
            placeholder="请输入ios版本号"
            oninput="value=value.replace(/[^\d\.]/g,'')"
          />
        </el-form-item>
      </el-card>
      <el-card class="box-card">
        <el-form-item label="安卓下载地址" prop="androidDownloadAddr">
          <el-input v-model="form.androidDownloadAddr" placeholder="请输入安卓下载地址" />
        </el-form-item>
        <el-form-item label="安卓版本号" prop="androidVersion">
          <el-input
            v-model="form.androidVersion"
            placeholder="请输入安卓版本号"
            oninput="value=value.replace(/[^\d\.]/g,'')"
          />
        </el-form-item>
      </el-card>
      <el-card class="box-card">
        <el-form-item label="是否强更" prop="force">
          <el-select v-model="form.force" placeholder="请选择是否强更" clearable>
            <el-option
              v-for="dict in dict.type.force"
              :key="parseInt(dict.value)"
              :label="dict.label"
              :value="parseInt(dict.value)"
            />
          </el-select>
        </el-form-item>
      </el-card>-->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" size="mini" @click="submitForm">确 定</el-button>
      <!-- <el-button size="mini" @click="cancel">取 消</el-button> -->
    </div>

    <!-- <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />-->

    <!-- 添加或修改用户全局配置对话框 -->
    <!-- <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-form-item label="最新的主页地址" prop="newDomainAddr">
          <el-input v-model="form.newDomainAddr" placeholder="请输入最新的主页地址" />
        </el-form-item>
        <el-form-item label="在线客服地址" prop="onlineServiceAddr">
          <el-input v-model="form.onlineServiceAddr" placeholder="请输入在线客服地址" />
        </el-form-item>
        <el-form-item label="官方群组地址" prop="groupAddr">
          <el-input v-model="form.groupAddr" placeholder="请输入官方群组地址" />
        </el-form-item>
        <el-form-item label="用户注册协议地址" prop="regProtocolAddr">
          <el-input v-model="form.regProtocolAddr" placeholder="请输入用户注册协议地址" />
        </el-form-item>
        <el-form-item label="推广链接地址" prop="promoteAddr">
          <el-input v-model="form.promoteAddr" placeholder="请输入推广链接地址" />
        </el-form-item>
        <el-form-item label="ios下载地址" prop="iosDownloadAddr">
          <el-input v-model="form.iosDownloadAddr" placeholder="请输入ios下载地址" />
        </el-form-item>
        <el-form-item label="ios版本号" prop="iosVersion">
          <el-input v-model="form.iosVersion" placeholder="请输入ios版本号" />
        </el-form-item>
        <el-form-item label="安卓下载地址" prop="androidDownloadAddr">
          <el-input v-model="form.androidDownloadAddr" placeholder="请输入安卓下载地址" />
        </el-form-item>
        <el-form-item label="安卓版本号" prop="androidVersion">
          <el-input v-model="form.androidVersion" placeholder="请输入安卓版本号" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>-->
  </div>
</template>

<script>
import { listHashUserConfig, getHashUserConfig, delHashUserConfig, addHashUserConfig, updateHashUserConfig } from "@/api/hash-user/hashUserConfig";
import UploadVue from '../../components/upload/Upload.vue'
export default {
  dicts: ['force'],
  name: "HashUserConfig",
  components: { UploadVue },
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
      // 用户全局配置表格数据
      hashUserConfigList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 表单参数
      form: {
        open_gg: 0
      },
      // 表单校验
      rules: {
        newDomainAddr: [
          { required: true, message: "最新的主页地址不能为空", trigger: "blur" }
        ],
        onlineServiceAddr: [
          { required: true, message: "在线客服地址不能为空", trigger: "blur" }
        ],
        groupAddr: [
          { required: true, message: "官方群组地址不能为空", trigger: "blur" }
        ],
        isSelfOnline: [
          { required: true, message: "请选择是否官方客服地址", trigger: "blur" }
        ],
        regProtocolAddr: [
          { required: true, message: "用户注册协议地址不能为空", trigger: "blur" }
        ],
        promoteAddr: [
          { required: true, message: "推广链接地址不能为空", trigger: "blur" }
        ],
        iosDownloadAddr: [
          { required: true, message: "ios下载地址不能为空", trigger: "blur" }
        ],
        iosVersion: [
          { required: true, message: "ios版本号不能为空", trigger: "blur" }
        ],
        androidDownloadAddr: [
          { required: true, message: "安卓下载地址不能为空", trigger: "blur" }
        ],
        androidVersion: [
          { required: true, message: "安卓版本号不能为空", trigger: "blur" }
        ],
        force: [
          { required: true, message: "请选择是否强更", trigger: "blur" }
        ],
        blockChainAddr: [
          { required: true, message: "请输入区块链地址", trigger: "blur" }
        ],
        webAddr: [
          { required: true, message: "请输入web端地址", trigger: "blur" }
        ],
        h5_qr_addr: [
          { required: true, message: "请输入中间下载页地址", trigger: "blur" }
        ],
        welecome_txt: [
          { required: true, message: "请输入欢迎语", trigger: "blur" }
        ],
        reg_limit: [
          { required: true, message: "请选择是否限制设备注册", trigger: "blur" }
        ],
        open_gg: [
          { required: true, message: "请选择是否开启广告", trigger: "blur" }
        ],
        gg_addr: [
          { required: true, message: "请选择是否开启广告", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    setImageUrl(param) {
      this.form.gg_addr = param.url
    },
    /** 查询用户全局配置列表 */
    getList() {
      this.loading = true;
      listHashUserConfig(this.queryParams).then(response => {
        this.hashUserConfigList = response.rows;
        this.form = response.rows[0];
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
        newDomainAddr: null,
        onlineServiceAddr: null,
        groupAddr: null,
        regProtocolAddr: null,
        promoteAddr: null,
        reg_limit: null,
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
      this.title = "添加用户全局配置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getHashUserConfig(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改用户全局配置";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateHashUserConfig(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addHashUserConfig(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除用户全局配置编号为"' + ids + '"的数据项？').then(function () {
        return delHashUserConfig(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('hash-user/hashUserConfig/export', {
        ...this.queryParams
      }, `hashUserConfig_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
<style  lang="scss" scoped>
.my-form {
  width: 800px;
  margin-left: 30px;
}

.dialog-footer {
  margin-left: 400px;
}

.box-card {
  margin-bottom: 10px;
}
</style>
