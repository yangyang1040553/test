<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="内容标题" prop="title">
        <el-input v-model="queryParams.title" placeholder="请输入内容标题" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="所属菜单" prop="menu">
        <el-input v-model="queryParams.menu" placeholder="请输入所属菜单" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="标签分类" prop="label">
        <el-input v-model="queryParams.label" placeholder="请输入标签分类" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="是否上架" prop="enable">
        <el-select v-model="queryParams.enable" placeholder="请选择是否上架" clearable>
          <el-option v-for="dict in dict.type.is_enable" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="封面图" prop="coverImg">
        <el-input v-model="queryParams.coverImg" placeholder="请输入封面图" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="热点值" prop="hotValue">
        <el-input v-model="queryParams.hotValue" placeholder="请输入热点值" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['hashUser:blackContent:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['hashUser:blackContent:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['hashUser:blackContent:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['hashUser:blackContent:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table :data="blackContentList" @selection-change="handleSelectionChange"
      element-loading-background="rgba(0, 0, 0, 0.8)">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="${comment}" align="center" prop="id" />
      <el-table-column label="内容标题" align="center" prop="title" />
      <el-table-column label="所属菜单" align="center" prop="menu" />
      <el-table-column label="标签分类" align="center" prop="label" />
      <el-table-column label="是否上架" align="center" prop="enable">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.is_enable" :value="scope.row.enable" />
        </template>
      </el-table-column>
      <el-table-column label="封面图" align="center" prop="coverImg" width="200px">
        <template slot-scope="scope">
          <img v-if="scope.row.coverImg" class="picture" :src="scope.row.coverImg" />
          <img v-else class="picture-bg" />
        </template>
      </el-table-column>
      <el-table-column label="文本内容" align="center" prop="des" />
      <!-- <el-table-column label="图片内容" align="center" prop="images" >
        <template slot-scope="scope">
          <img  class="picture" :src="scope.row.images.split(',')[0]" />
        </template>
      </el-table-column>
      <el-table-column label="视频内容" align="center" prop="videos" /> -->
      <el-table-column label="黑料类型" align="center" prop="blackType" />
      <el-table-column label="热点值" align="center" prop="hotValue" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="center" prop="updateTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['hashUser:blackContent:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['hashUser:blackContent:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改黑料内容对话框 -->
    <el-dialog :title="title" class="dialog" :visible.sync="open" width="800px" append-to-body v-loading="loading">
      <el-form class="form" ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="内容标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入内容标题" />
        </el-form-item>
        <el-form-item label="所属菜单" prop="menu">
          <el-input v-model="form.menu" placeholder="请输入所属菜单" />
        </el-form-item>
        <el-form-item label="标签分类" prop="label">
          <el-input v-model="form.label" placeholder="请输入标签分类" />
        </el-form-item>
        <el-form-item label="是否上架" prop="enable">
          <el-select v-model="form.enable" placeholder="请选择是否上架">
            <el-option v-for="dict in dict.type.is_enable" :key="dict.value" :label="dict.label"
              :value="parseInt(dict.value)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="热点值" prop="hotValue">
          <el-input v-model="form.hotValue" placeholder="请输入热点值" />
        </el-form-item>
        <el-form-item style="height: 150px;" label="封面图" prop="coverImg">
          <el-upload class="picturDiv" list-type="picture-card" :on-change="onCoverChange" :http-request="upload" action
            :limit="1">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="文本内容" prop="des">
          <el-input v-model="form.des" type="textarea" placeholder="请输入内容" />
        </el-form-item>

        <el-form-item class="videos-item" label="视频内容" prop="videos">
          <el-upload multiple class="upload-demo" :fileList="videoList" action :http-request="upload"
            :on-change="onVideoChange">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item class="pic-item" label="图片内容" prop="images">
          <el-upload class="picturDiv" ref="pictureRef" list-type="picture-card" multiple :on-change="onPictureChange"
            :http-request="upload" action :limit="20">
            <i class="el-icon-plus"></i>
          </el-upload>
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
import { listBlackContent, getBlackContent, delBlackContent, addBlackContent, updateBlackContent, uploadFile } from "@/api/hashUser/blackContent";

export default {
  name: "BlackContent",
  dicts: ['is_enable'],
  data() {
    return {
      // 遮罩层
      // 选中数组
      ids: [],
      height: 200,
      videoUrl: "",
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      loading: false,
      // 总条数
      total: 0,
      // 黑料内容表格数据
      blackContentList: [],
      // 图片数组
      pictureList: [],
      videoList: [],
      coverFileList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      count: 0,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: null,
        menu: null,
        label: null,
        enable: null,
        coverImg: null,
        des: null,
        images: null,
        videos: null,
        blackType: null,
        hotValue: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [
          { required: true, message: "内容标题不能为空", trigger: "blur" }
        ],
        menu: [
          { required: true, message: "所属菜单不能为空", trigger: "blur" }
        ],
        enable: [
          { required: true, message: "是否上架 0否 1是不能为空", trigger: "change" }
        ],
        coverImg: [
          { required: true, message: "封面图不能为空", trigger: "blur" }
        ],
        des: [
          { required: true, message: "文本内容不能为空", trigger: "blur" }
        ],
        blackType: [
          { required: true, message: "黑料类型 -1文本广告 0正常文章类型 1外链跳转广告类型不能为空", trigger: "change" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    upload(file) {
      // console.log("upload==", file)
      // console.log("upload==", this.pictureList)

      // 在这个地方调用上传得接口

    },
    onCoverChange(file, fileList) {
      console.log(fileList);
      this.coverFileList = fileList
    },
    onPictureChange(file, fileList) {
      console.log(fileList);
      this.pictureList = fileList

    },
    onVideoChange(file, fileList) {
      console.log(file);
      console.log(fileList);
      // this.videoList.forEach((element, index) => {
      //   console.log(element)
      //   console.log(index)
      // });
      if (['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb', 'video/mov'].indexOf(file.raw.type) == -1) {
        this.$message.error('文件类型错误，请重新选择');
        return false;
      }
      this.videoList = fileList
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      console.log("handlePictureCardPreview=", file);
    },
    /** 查询黑料内容列表 */
    getList() {
      this.loading = true;
      listBlackContent(this.queryParams).then(response => {
        this.blackContentList = response.rows;
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
        title: null,
        menu: null,
        label: null,
        enable: null,
        coverImg: null,
        des: null,
        images: null,
        videos: null,
        blackType: null,
        hotValue: null,
        createTime: null,
        updateTime: null
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
      this.title = "添加黑料内容";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getBlackContent(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改黑料内容";
      });
    },
    /** 提交按钮 */
    submitForm() {

      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });

      const formData = new FormData();
      this.pictureList.forEach((file) => {
        formData.append("files", file.raw);
      });
      console.log("formData===", formData)
      uploadFile(formData).then(res => {
        console.log(res)
        vim.count++
      })

      let vim = this
      let interval = setInterval(() => {
        if (vim.count == 1) {


          loading.close()
          vim.open = false
          clearInterval(interval)

          console.log("提交内容")
          // this.$refs["form"].validate(valid => {
          //   if (valid) {
          //     if (this.form.id != null) {
          //       updateBlackContent(this.form).then(response => {
          //         this.$modal.msgSuccess("修改成功");
          //         this.open = false;
          //         this.getList();
          //       });
          //     } else {
          //       addBlackContent(this.form).then(response => {
          //         this.$modal.msgSuccess("新增成功");
          //         this.open = false;
          //         this.getList();
          //       });
          //     }
          //   }
          // });


        }
      }, 500)


    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除黑料内容编号为"' + ids + '"的数据项？').then(function () {
        return delBlackContent(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('hashUser/blackContent/export', {
        ...this.queryParams
      }, `blackContent_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
<style scoped  lang="scss">
.picture {
  width: 190px;
  height: 110px;
  border-radius: 4px;
}

.picture-bg {
  background-color: #e0e0e0;
  width: 190px;
  height: 110px;
  border-radius: 4px;
}

.videos-item {
  display: block;
  height: 200px;
  overflow-y: auto;
  padding-top: 10px !important;
}

.videoPic {
  width: 148px;
  height: 148px;
}

.form {
  display: flex;
  flex-direction: column;
}

.dialog {
  height: 90% !important;
}

.picturDiv {
  min-height: 120px;
  height: auto;
}

.pic-item {
  min-height: 400px;
  overflow-y: auto;
  padding-top: 20px;
}
</style>
