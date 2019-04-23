<template>
  <div class="container">
    <div class="login_box">
      <div class="logo">
        <img src="../assets//images/logo.png" alt="" />
      </div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item prop="name">
          <el-input v-model="ruleForm.user_nickname" placeholder="请输入用户名">
            <i slot="prefix" class="iconfont icon-user"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            placeholder="请输入密码"
            v-model="ruleForm.user_pass"
            show-password
          >
            <i slot="prefix" class="iconfont icon-showpassword"></i>
          </el-input>
        </el-form-item>
      </el-form>
      <div class="btn_box">
        <el-button type="primary" @click="login">登录</el-button>
        <el-button type="danger" @click="resetForm">重置</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {
        user_nickname: "admin",
        user_pass: "123456"
      },
      obj: {
        order_type: 1
      },
      rules: {
        user_nickname: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 1, max: 7, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        user_pass: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 12, message: "长度在 6 到 12 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
    login() {
      /* 封装的处理axios 请求数据问题 只能处理对象 不能处理数组*/
      var p = this.$param(this.ruleForm);
      this.$refs.ruleForm.validate(async result => {
        if (!result) return;
        const { data: data } = await this.$http.post("users/login", p);
        if (data.code == 1) {
          this.$message({
            type: "success",
            message: "登录成功"
          });
        window.localStorage.setItem('token',data.data.token)
        this.$router.push('/welcome')
        }
      });
    }
  }
};
</script>
<style scoped>
.container {
  width: 100%;
  height: 100%;
  background-color: #d8505c;
  overflow: hidden;
  user-select: none;
}
.login_box {
  width: 450px;
  height: 300px;
  background: #fff;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  border-radius: 15px;
}
.logo {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin: -70px auto 50px;
  background-color: #ccc;
  border: 10px solid #f8f8f8;
  overflow: hidden;
  box-shadow: 0px 0px 10px #fff;
}
.logo img {
  width: 100%;
  height: 100%;
  display: block;
}
.el-form-item {
  width: 90%;
  margin: 30px 5%;
}
.el-form-item:last-child {
  margin: 20px 5%;
}
.btn_box {
  text-align: right;
  margin-right: 5%;
}
</style>
