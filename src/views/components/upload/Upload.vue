<template>
  <div>
    <el-upload
      class="avatar-uploader"
      :limit="limit"
      action
      :show-file-list="false"
      :http-request="upload"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script>
import { uploadFile } from '@/utils/upload'
export default {
  data() {
    return {
      imageUrl: ''
    };
  },
  props: ["url", "limit", "index"],
  watch: {
    url(news, old) {
      //   console.log("1111===", news)
      this.imageUrl = news
    }
  },
  created() {
    this.imageUrl = this.url
  },
  methods: {
    upload(param) {
    //   console.log(param)
      uploadFile(param.file).then(res => {
        // console.log("rss===", res.url)
        this.imageUrl = res.url
        if (this.index) {
          this.$emit("setImageUrl", { url: res.url, index: this.index })
        } else {
          this.$emit("setImageUrl", res.url)
        }
      })
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/png' || 'image/jpg' || 'image/webp';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG/PNG/WEBP 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    }
  }
}
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 108px;
  line-height: 108px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 108px;
  display: block;
}
</style>