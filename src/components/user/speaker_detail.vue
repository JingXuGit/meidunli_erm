<template>
  <!-- 添加讲者信息 -->
  <div class="container">
    <!-- 头部面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/Speaker' }"
        >讲者列表</el-breadcrumb-item
      >
      <el-breadcrumb-item>新增讲者信息</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表单 -->
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="讲者姓名" prop="speak_name">
        <el-input
          v-model="ruleForm.speak_name"
          placeholder="请输入讲者姓名"
        ></el-input>
      </el-form-item>
      <el-form-item label="职称" prop="speak_job_name">
        <el-input
          v-model="ruleForm.speak_job_name"
          placeholder="请输入讲者身份"
        ></el-input>
      </el-form-item>
      <el-form-item label="一级单位" prop="speak_one">
        <el-input
          v-model="ruleForm.speak_one"
          placeholder="请输入一级单位"
        ></el-input>
      </el-form-item>
      <el-form-item label="二级单位" prop="speak_two">
        <el-input
          v-model="ruleForm.speak_two"
          placeholder="请输入二级单位"
        ></el-input>
      </el-form-item>
      <el-form-item label="上传头像" prop="speak_avatar">
        <el-upload
          class="upload-demo"
          :action="$config.url + '/admin/speak/upload/'"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList"
          list-type="picture"
          :limit="1"
          :multiple="false"
          :on-success="success"
          :on-error="error"
          :before-upload="beforeUpload"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="是否启用" prop="is_qiyong">
        <el-radio-group v-model="ruleForm.is_qiyong">
          <template>
            <el-radio label="1" v-model="ruleForm.is_qiyong">启用</el-radio>
            <el-radio label="0" v-model="ruleForm.is_qiyong">禁用</el-radio>
          </template>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="讲者简介" prop="speak_info">
        <el-input
          type="textarea"
          v-model="ruleForm.speak_info"
          placeholder="请输入讲者简介"
          autosize
          maxlength="100"
        ></el-input>
      </el-form-item>
    </el-form>
    <div style="margin-left:100px;">
      <el-button type="primary" @click="addSpeaker">提交</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {
        speak_name: "",
        speak_job_name: "",
        speak_one: "",
        speak_two: "",
        is_qiyong: "1",
        token: window.localStorage.getItem("token"),
        speak_avatar: "",
        speak_info: ""
      },
      rules: {
        speak_name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        speak_job_name: [
          { required: true, message: "请选择讲者职称", trigger: "blur" }
        ],
        speak_one: [
          {
            required: true,
            message: "请输入一级单位",
            trigger: "blur"
          }
        ],
        speak_two: [
          {
            required: true,
            message: "请输入二级单位",
            trigger: "blur"
          }
        ],
        is_qiyong: [
          { required: true, message: "请选择是否启用", trigger: "change" }
        ],
        // speak_avatar: [
        //   { required: true, message: "请上传图片", trigger: "change" }
        // ],
        speak_info: [
          { required: true, message: "请填写讲者简介", trigger: "blur" }
        ]
      },
      fileList: [
        // {
        //   name: "",
        //   url: ""
        // }
      ]
    };
  },
  created() {},
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    /* 上传 */
    handleRemove(file, fileList) {},
    handlePreview(file) {},
    success(response, file, fileList) {
      this.ruleForm.speak_avatar = file.response.data.url;
    },
    error() {},
    /* 添加讲者 */
    addSpeaker() {
      var p = this.$param(this.ruleForm);
      this.$refs.ruleForm.validate(async result => {
        if (!result) return;
        const { data: data } = await this.$http.post("speak/addPost", p);
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
          this.$router.push("/speaker");
        }
      });
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
    }
  }
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
