<template>
  <div>
    <el-upload
      :action="uploadUrl"
      :before-upload="handleBeforeUpload"
      :on-success="handleUploadSuccess"
      :on-error="handleUploadError"
      name="file"
      :show-file-list="false"
      :headers="headers"
      style="display: none"
      ref="upload"
      v-if="this.type == 'url'"
    ></el-upload>
    <div class="box">
      <div id="toolbar-container" class="toolbar-container"></div>
      <div id="editor-container" class="editor-container" :style="'min-height:'+minHeight+'px;'"></div>
    </div>
  </div>
</template>

<script>
import '@wangeditor/editor/dist/css/style.css'
import { createEditor, createToolbar, IEditorConfig, IDomEditor } from '@wangeditor/editor'
import { getToken } from "@/utils/auth";

let editor = null

export default {
  name: "Editor",
  props: {
    /* 编辑器的内容 */
    value: {
      type: String,
      default: "",
    },
    /* 高度 */
    height: {
      type: Number,
      default: null,
    },
    /* 最小高度 */
    minHeight: {
      type: Number,
      default: null,
    },
    /* 只读 */
    readOnly: {
      type: Boolean,
      default: false,
    },
    // 上传文件大小限制(MB)
    fileSize: {
      type: Number,
      default: 5,
    },
    /* 类型（base64格式、url格式） */
    type: {
      type: String,
      default: "url",
    }
  },
  data() {
    return {
      uploadUrl: process.env.VUE_APP_BASE_API + "/common/upload", // 上传的图片服务器地址
      headers: {
        Authorization: "Bearer " + getToken()
      },
      currValue: '',
      editor: null
    };
  },
  computed: {
    styles() {
      let style = {};
      if (this.minHeight) {
        style.minHeight = `${this.minHeight}px`;
      }
      if (this.height) {
        style.height = `${this.height}px`;
      }
      return style;
    },
  },
  watch: {
    value(news, old) {
      // console.log("this.editor==", editor)
      // console.log("nes==", news)
      this.currValue = news
      editor.setHtml(this.currValue)
    }
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    this.Quill = null;
  },
  methods: {
    init() {
      const editorConfig = { MENU_CONF: {} }
      editorConfig.MENU_CONF['uploadImage'] = {
        server: process.env.VUE_APP_BASE_API + "/common/upload",
        fieldName: 'file',
        // 单个文件的最大体积限制，默认为 2M
        maxFileSize: 2 * 1024 * 1024, // 1M
        // 最多可上传几个文件，默认为 100
        maxNumberOfFiles: 1,
        // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
        allowedFileTypes: ['image/*'],
        // 自定义上传参数，例如传递验证的 token 等。参数会被添加到 formData 中，一起上传到服务端。
        meta: {
          // Authorization: "Bearer " + getToken()
        },
        // 将 meta 拼接到 url 参数中，默认 false
        metaWithUrl: false,
        // 自定义增加 http  header
        headers: {
          // Accept: 'text/x-json',
          Authorization: "Bearer " + getToken()
        },
        // 跨域是否传递 cookie ，默认为 false
        // withCredentials: true,
        // 超时时间，默认为 10 秒
        timeout: 5 * 1000, // 5 秒
        // 上传之前触发
        onBeforeUpload(file) {
          // file 选中的文件，格式如 { key: file }
          return file
        },
        // 上传进度的回调函数
        onProgress(progress) {
          // progress 是 0-100 的数字
          // console.log('progress', progress)
        },
        // 单个文件上传成功之后
        onSuccess(file, res) {
          // console.log(`${file.name} 上传成功`, res)
        },
        // 单个文件上传失败
        onFailed(file, res) {
          // console.log(`${file.name} 上传失败`, res)
        },
        // 上传错误，或者触发 timeout 超时
        onError(file, err, res) {
          // console.log(`${file.name} 上传出错`, err, res)
        },
      }

      editorConfig.MENU_CONF['lineHeight'] = {
        lineHeightList: ['0.5', '0.75', '1', '1.5', '2', '2.5']
      }

      editorConfig.placeholder = '请输入内容'
      editorConfig.onChange = (editor) => {
        // 当编辑器选区、内容变化时，即触发
        // console.log('content---', editor.children)
        // console.log('html---', editor.getHtml())
        const html = editor.getHtml();
        const text = editor.getText()

        this.$emit("input", html);
        this.$emit("on-change", { html, text, editor });
      }

      // 工具栏配置
      const toolbarConfig = {}

      // 创建编辑器
      editor = createEditor({
        selector: '#editor-container',
        config: editorConfig,
        mode: 'default',
        html: this.value
      })

      console.log(" this.editor", this.editor)

      // 创建工具栏
      const toolbar = createToolbar({
        editor,
        selector: '#toolbar-container',
        config: toolbarConfig,
        mode: 'default' // 或 'simple' 参考下文
      })


    },
    // 上传前校检格式和大小
    handleBeforeUpload(file) {
      // 校检文件大小
      if (this.fileSize) {
        const isLt = file.size / 1024 / 1024 < this.fileSize;
        if (!isLt) {
          this.$message.error(`上传文件大小不能超过 ${this.fileSize} MB!`);
          return false;
        }
      }
      return true;
    },
    handleUploadSuccess(res, file) {
      // 获取富文本组件实例
      let quill = this.Quill;
      // 如果上传成功
      if (res.code == 200) {
        // 获取光标所在位置
        let length = quill.getSelection().index;
        // 插入图片  res.url为服务器返回的图片地址
        quill.insertEmbed(length, "image", process.env.VUE_APP_BASE_API + res.fileName);
        // 调整光标到最后
        quill.setSelection(length + 1);
      } else {
        this.$message.error("图片插入失败");
      }
    },
    handleUploadError() {
      this.$message.error("图片插入失败");
    },
  },
};
</script>


<style>
.w-e-bar-item button .title {
  margin-left: 5px;
  margin-top: 30px;
  height: 32px;
  line-height: 32px;
  /* padding-top: 30px !important; */
}
</style>

<style  lang="scss" scoped>
.box {
  border: 1px solid gainsboro;
  .editor {
    /* height: 420px; */

    margin: 5px;
  }

  .toolbar-container {
    position: relative;
    border-bottom: 1px solid gainsboro !important;
  }

  .editor-container {
    /* height: 420px; */
  }
}
</style>
