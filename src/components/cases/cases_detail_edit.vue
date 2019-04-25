<template>
  <!-- 添加病种列表 -->
  <div class="container">
    <!-- 头部面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>素材管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/Cases' }">病例列表</el-breadcrumb-item>
      <el-breadcrumb-item>新增病例详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- TOOD form 表单域 -->
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="病例标题" prop="post_title">
        <el-input
          v-model="ruleForm.post_title"
          placeholder="请输入病例标题"
        ></el-input>
      </el-form-item>
      <el-form-item label="讲者" prop="speak_id">
        <el-select v-model="ruleForm.speak_id" placeholder="请选择专家">
          <el-option
            v-for="item in speaker"
            :key="item.sid"
            :label="item.speak_name"
            :value="item.sid"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="病种" prop="post_type">
        <el-select v-model="ruleForm.post_type" placeholder="请选择病种">
          <el-option label="糖尿病" value="1"></el-option>
          <el-option label="痛风/高尿酸血症" value="2"></el-option>
          <el-option label="甲状腺疾病" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number
          v-model="ruleForm.order_num"
          @change="handleChange"
          :min="0"
          :max="10"
          label="描述文字"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="是否显示" prop="is_qiyong">
        <el-radio-group v-model="ruleForm.is_qiyong">
          <el-radio :label="1">显示</el-radio>
          <el-radio :label="0">不显示</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="上传图片" prop="thumbnail">
        <el-upload
          class="upload-demo"
          :action="'/admin/speak/upload/'"
          :on-exceed="onExceed"
          :http-request="onUpload"
          :file-list="fileList"
          list-type="picture"
          :limit="1"
          :multiple="false"
          :on-success="success"
          :before-upload="beforeUpload"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="音频地址" prop="audio">
        <el-input
          v-model="ruleForm.audio"
          placeholder="请输入音频地址"
        ></el-input>
      </el-form-item>
      <!-- 富文本编辑器 -->
      <el-form-item>
        <el-upload
          :action="'/admin/speak/upload/'"
          :http-request="quillUploadImg"
          :file-list="editFilelist"
          list-type="picture"
          :multiple="true"
          style="display:none"
        >
          <el-button id="imgInput" size="small" type="primary"
            >点击上传</el-button
          >
        </el-upload>
        <quill-editor
          v-model="ruleForm.post_content"
          ref="myQuillEditor"
          :options="editorOption"
        >
        </quill-editor>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm()">确认</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { quillEditor, Quill } from "vue-quill-editor";
import { container, ImageExtend, QuillWatch } from "quill-image-extend-module";
import { uploadImg } from "../../CosAuth.js";
Quill.register("modules/ImageExtend", ImageExtend);
export default {
  components: { quillEditor },
  data() {
    return {
      editorOption: {
        modules: {
          ImageExtend: {
            loading: true,
            name: "file",
            action: this.$config.url + "/admin/speak/upload/",
            response: res => {
              return this.$config.url + res.data.url;
            }
          },
          toolbar: {
            container: container,
            handlers: {
              image: function() {
                // QuillWatch.emit(this.quill.id);
                let fileInput = document.getElementById("imgInput");
                fileInput.click(); // 加一个触发事件
              }
            }
          }
        }
      },
      /* 表单数据 */
      ruleForm: {
        speak_id: "",
        post_title: "",
        post_type: "",
        post_content: "",
        is_qiyong: null,
        audio: "1.mp3",
        order_num: "0",
        thumbnail: "",
        token: window.localStorage.getItem("token")
      },
      /* 表单规则 */
      rules: {
        post_title: [
          { required: true, message: "请输入病例标题", trigger: "blur" }
        ],
        speak_id: [
          { required: true, message: "请选择讲者", trigger: "change" }
        ],
        post_type: [
          { required: true, message: "请选择病种", trigger: "change" }
        ],
        is_qiyong: [
          { required: true, message: "请选择是否显示", trigger: "change" }
        ],
        thumbnail: [
          { required: true, message: "请上传图片", trigger: "change" }
        ],
        audio: [{ required: true, message: "请输入音频地址", trigger: "blur" }]
      },
      fileList: [
        {
          url: "",
          name: ""
        }
      ],
      editFilelist: [],
      /* 讲者列表 */
      speaker: []
    };
  },
  created() {
    this.speaker_list();
    this.list(this.$route.query.id);
  },
  methods: {
    /* 讲者列表 */
    async speaker_list() {
      let param = new URLSearchParams();
      param.append("token", window.localStorage.getItem("token"));
      const { data: data } = await this.$http.post("speak/getSpeakList", param);
      this.speaker = data.data;
    },
    /* 获取数据展示 */
    async list(id) {
      let param = new URLSearchParams();
      param.append("id", id);
      param.append("token", window.localStorage.getItem("token"));
      const { data: data } = await this.$http.post("case/edit", param);
      let tmpToken = this.ruleForm.token;
      this.ruleForm = data.data[0];
      this.ruleForm.token = tmpToken;
      this.fileList[0].url = data.data[0].thumbnail;
      if (this.ruleForm.post_type == 1) {
        this.ruleForm.post_type = "糖尿病";
      } else if (this.ruleForm.post_type == 2) {
        this.ruleForm.post_type = "尿毒症";
      } else if (this.ruleForm.post_type == 3) {
        this.ruleForm.post_type = "脑血栓";
      }
    },
    /* 点击确定按钮 */
    submitForm() {
      this.$refs.ruleForm.validate(async valid => {
        if (!valid) return;
        if (this.ruleForm.post_type == "糖尿病") {
          this.ruleForm.post_type = 1;
        } else if (this.ruleForm.post_type == "尿毒症") {
          this.ruleForm.post_type = 2;
        } else if (this.ruleForm.post_type == "脑血栓") {
          this.ruleForm.post_type = 3;
        }
        let p = this.$param(this.ruleForm);
        const { data: data } = await this.$http.post("case/editPost", p);
        if (data.code != 1) {
          this.$message({
            type: "error",
            message: data.msg
          });
        } else {
          this.$message({
            type: "success",
            message: data.msg
          });
          this.$router.push("/cases");
        }
      });
    },
    /* 重置 */
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    /* 上传 */

    handleChange(value) {},
    success(response, file, fileList) {
      this.ruleForm.thumbnail = file.response.data.url;
    },
    beforeUpload(file) {
      console.log(file.size);
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isLt2M) {
        this.$message({
          message: "上传文件大小不能超过 5MB!",
          type: "warning"
        });
      }
      return isLt2M;
    },
    /* 上传到腾讯云 */
    onUpload(param) {
      this.uploadImg(param.file);
    },
    onExceed(param) {
      this.uploadImg(param[0]);
    },
    uploadImg(file) {
      if (!file) return;
      uploadImg(file, (err, data) => {
        if (err) {
          this.$message("图片上传失败");
          return;
        }
        if (data.statusCode == 200) {
          let imgurl = data.Location;
          if (imgurl.indexOf("http") != 0) {
            imgurl = "https://" + imgurl;
          }
          this.ruleForm.thumbnail = imgurl;
          this.fileList[0].url = imgurl;
        }
      });
    },
    /* 富文本编辑器上传腾讯云 */
    quillUploadImg(param) {
      var file = param.file;
      if (!file) return;
      uploadImg(file, (err, data) => {
        if (err) {
          this.$message("图片上传失败");
          return;
        }
        if (data.statusCode == 200) {
          let imgurl = data.Location;
          if (imgurl.indexOf("http") != 0) {
            imgurl = "https://" + imgurl;
          }
          let length =
            (this.$refs.myQuillEditor.quill.getSelection() || {}).index ||
            this.$refs.myQuillEditor.quill.getLength();
          this.$refs.myQuillEditor.quill.insertEmbed(
            length,
            "image",
            imgurl,
            "user"
          );
          this.$refs.myQuillEditor.quill.setSelection(length + 1);
        }
      });
    }
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    }
  },

};
</script>
<style scoped>
.container {
  width: 60%;
}
.el-input {
  width: 50%;
}
</style>
