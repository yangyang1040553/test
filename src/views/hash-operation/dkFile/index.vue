<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="存储桶列表" prop="upOssList">
        <el-input
          v-model="queryParams.upOssList"
          placeholder="请输入存储桶列表"
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
          v-hasPermi="['hash-operation:dkFile:add']"
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
          v-hasPermi="['hash-operation:dkFile:edit']"
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
          v-hasPermi="['hash-operation:dkFile:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hash-operation:dkFile:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      height="600"
      :data="dkFileList"
      @sort-change="sortChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="配置文件" align="center" prop="json">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <div class="hover-div">{{ scope.row.json }}</div>
            <div class="text-content name-wrapper" slot="reference">{{ scope.row.json }}</div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="存储桶列表" align="center" prop="upOssList" />
      <el-table-column label="创建时间" align="center" prop="createTime" sortable />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['hash-operation:dkFile:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['hash-operation:dkFile:remove']"
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

    <!-- 添加或修改对抗配置文件对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" class="form" label-width="100px">
        <el-form-item label="存储桶列表" prop="upOssList">
          <!-- <el-input placeholder="请输入存储桶列表" /> -->
          <!-- <el-select v-model="form.upOssList" style="width:500px;" placeholder="请选择存储桶" clearable></el-select> -->

          <el-select
            v-model="selecOssList"
            multiple
            style="width:500px;"
            collapse-tags
            placeholder="请选存储桶"
            @change="onOssSelect"
          >
            <el-option
              v-for="dict in ossList"
              :key="dict.bucketName"
              :label="dict.bucketName"
              :value="dict.bucketName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="域名列表">
          <!-- <el-input placeholder="请输入存储桶列表" /> -->
          <!-- <el-select v-model="selectDomain" placeholder="请选域名" clearable>
            <el-option
              v-for="dict in domainList"
              :key="dict.domain"
              :label="dict.domain"
              :value="dict.domain"
            />
          </el-select>-->

          <el-select
            v-model="selectDomain"
            multiple
            style="width:500px;"
            collapse-tags
            placeholder="请选域名"
            @change="onDomainSelect"
          >
            <el-option
              v-for="dict in domainList"
              :key="dict.domain"
              :label="dict.domain"
              :value="dict.domain"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="配置文件" prop="json">
          <!-- <el-input v-model="form.json" type="textarea" placeholder="请输入内容" /> -->
          <vue-json-editor
            v-model="resultInfo"
            :showBtns="false"
            :mode="'code'"
            @json-change="onJsonChange"
            @json-save="onJsonSave"
            @has-error="onError"
            class="editor"
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
import { listDkFile, getDkFile, delDkFile, addDkFile, updateDkFile } from "@/api/hash-operation/dkFile";
import { listDomanList } from "@/api/hash-operation/domanList";
import { listDkOss } from "@/api/hash-operation/dkOss";
import vueJsonEditor from 'vue-json-editor'
export default {
  name: "DkFile",
  components: {
    vueJsonEditor
  },
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
      // 对抗配置文件表格数据
      dkFileList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        upOssList: null,
        createTime: null,
        orderByColumn: 'createTime',
        isAsc: 'desc'
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        json: [
          { required: true, message: "配置文件不能为空", trigger: "blur" }
        ],
        upOssList: [
          { required: true, message: "存储桶列表不能为空", trigger: "blur" }
        ],
        selectDomain: [
          { required: true, message: "域名列表不能为空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ]
      },
      hasJsonFlag: true,
      resultInfo: {},
      domainList: [],
      ossList: [],
      selectDomain: [],
      selecOssList: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    onOssSelect() {
      let str = ""
      this.selecOssList.forEach(element => {
        str = str + element + ","
      })
      if (str.length > 0) {
        str = str.substring(0, str.length - 1)
      }
      console.log(str)
      this.form.upOssList = str
    },
    onDomainSelect() {
      console.log(this.selectDomain)
      // if (!this.resultInfo.domains) {
      //   this.resultInfo.domains = []
      // }
      let arr = []
      this.selectDomain.forEach(element => {
        let obj = {
          domain: element,
          weight: 1,
          type: ''
        }
        arr.push(obj)
      })
      console.log("arr=" + arr)
      let domains = arr
      let obj = { ...this.resultInfo }
      obj.domains = domains
      this.resultInfo = JSON.parse(JSON.stringify(obj))
      console.log(" this.resultInfo=" + this.resultInfo)
      this.form.json = JSON.stringify(this.resultInfo)
    },
    sortChange(val) {
      console.log(val)
      if (val.order && val.order == 'descending') {
        this.queryParams.isAsc = 'desc'
      } else {
        this.queryParams.isAsc = 'asc'
      }
      this.queryParams.orderByColumn = val.prop && val.prop
      this.getList()
    },
    onJsonChange(value) {
      // console.log('更改value:', value);
      // 实时保存
      this.onJsonSave(value)
    },
    onJsonSave(value) {
      // console.log('保存value:', value);
      this.resultInfo = value
      this.form.json = value
      this.hasJsonFlag = true
    },
    onError(value) {
      // console.log("json错误了value:", value);
      this.hasJsonFlag = false
    },
    /** 查询对抗配置文件列表 */
    getList() {
      this.loading = true;
      listDkFile(this.queryParams).then(response => {
        this.dkFileList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    getDomainList() {
      listDomanList().then(response => {
        if (response.rows) {
          this.domainList = []
          response.rows.forEach(element => {
            if (element.status == 1) {
              this.domainList.push(element)
            }
          });
        }
      })
    },
    getOssList() {
      listDkOss().then(response => {
        if (response.rows) {
          this.ossList = response.rows
        }
      })
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
        json: null,
        upOssList: null,
        createTime: null,
        orderByColumn: 'createTime',
        isAsc: 'desc'
      };
      this.selectDomain = []
      this.selecOssList = []
      this.resultInfo = JSON.parse(JSON.stringify({}))
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
      this.title = "添加对抗配置文件";
      this.getDomainList()
      this.getOssList()
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getDkFile(id).then(response => {
        this.form = response.data;
        this.resultInfo = JSON.parse(this.form.json)
        this.open = true;
        this.title = "修改对抗配置文件";
      });
      this.getDomainList()
      this.getOssList()
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid && this.hasJsonFlag) {
          this.form.json = JSON.stringify(this.resultInfo)
          if (this.form.id != null) {
            updateDkFile(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDkFile(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除对抗配置文件编号为"' + ids + '"的数据项？').then(function () {
        return delDkFile(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('hash-operation/dkFile/export', {
        ...this.queryParams
      }, `dkFile_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
<style lang="scss" scoped>
.form {
  height: 60vh;

  .editor,
  .jsoneditor-vue {
    height: 50vh;
  }
}

.text-content {
  max-height: 50px !important;
  overflow: hidden;
}

.hover-div {
  max-width: 300px;
}

::v-deep .jsoneditor {
  height: 50vh;
}
</style>
