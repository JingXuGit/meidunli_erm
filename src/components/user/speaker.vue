<template>
  <!-- 讲者列表 -->
  <div class="container">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>讲者列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加按钮 -->
    <el-button
      type="primary"
      icon="el-icon-edit"
      style="margin-bottom:20px;"
      @click="navigate"
      >添加</el-button
    >
    <!-- 表格展示数据 -->
    <el-table :data="tableData" border stripe>
      <el-table-column prop="sid" label="ID" align="center"> </el-table-column>
      <el-table-column prop="speak_name" label="姓名" align="center">
        <!-- <template slot-scope="scope">
          {{ scope.row.date | dateFormat }}
        </template> -->
      </el-table-column>
      <el-table-column
        prop="speak_info"
        label="讲者介绍"
        align="center"
        width="300"
      >
      </el-table-column>
      <el-table-column
        prop="speak_one"
        label="一级单位"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="speak_two"
        label="二级单位"
        align="center"
      ></el-table-column>
      <el-table-column prop="speak_job_name" label="职称" align="center">
      </el-table-column>
      <el-table-column prop="is_qiyong" label="是否禁用" align="center">
        <!-- 自定义插槽 -->
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.is_qiyong == 1">启用</el-tag>
          <el-tag type="warning" v-else>禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="medium" @click="edit(scope.row.sid)"
            >编辑</el-button
          >
          <el-button
            type="primary"
            size="danger"
            @click="delete_(scope.row.sid)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 点击编辑弹出框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="editForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-input v-model="ruleForm.sid" type="hidden"></el-input>
        <el-form-item label="姓名" prop="speak_name">
          <el-input v-model="ruleForm.speak_name"></el-input>
        </el-form-item>
        <el-form-item label="讲者介绍" prop="speak_info">
          <el-input v-model="ruleForm.speak_info"></el-input>
        </el-form-item>
        <el-form-item label="一级单位" prop="speak_one">
          <el-input v-model="ruleForm.speak_one"></el-input>
        </el-form-item>
        <el-form-item label="二级单位" prop="speak_two">
          <el-input v-model="ruleForm.speak_two"></el-input>
        </el-form-item>
        <el-form-item label="上传头像" prop="speak_avatar">
          <el-upload
            class="upload-demo"
            :action="'/admin/speak/upload/'"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-exceed="onExceed"
            :http-request="onUpload"
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
        <el-form-item label="职称" prop="speak_job_name">
          <el-input v-model="ruleForm.speak_job_name"></el-input>
        </el-form-item>
        <el-form-item label="是否禁用" prop="is_qiyong">
          <el-radio-group v-model="ruleForm.is_qiyong">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editEnter">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分页功能 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[size]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="count"
    >
    </el-pagination>
  </div>
</template>
<script>
import { uploadImg } from "../../CosAuth.js";
export default {
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      count: 0,
      page: 1,
      size: 0,
      ruleForm: {
        sid: "",
        speak_name: "",
        speak_avatar: "",
        speak_info: "",
        speak_one: "",
        speak_two: "",
        speak_job_name: "",
        is_qiyong: "",
        token: ""
      },
      fileList: [
        {
          url: "",
          name: ""
        }
      ],
      rules: {
        speak_name: [
          { required: true, message: "请输入姓名", trigger: "blur" }
        ],
        speak_info: [
          { required: true, message: "请输入讲者介绍", trigger: "blur" }
        ],
        speak_one: [
          { required: true, message: "请输入一级单位", trigger: "blur" }
        ],
        speak_two: [
          { required: true, message: "请输入二级单位", trigger: "blur" }
        ],
        speak_job_name: [
          { required: true, message: "请输入职称", trigger: "blur" }
        ],
        is_qiyong: [
          { required: true, message: "请选择是否启用", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.speaker();
  },
  methods: {
    navigate() {
      this.$router.push("/Speaker_detail");
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    /* 分页 */
    async handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;
      let param = new URLSearchParams();
      param.append("token", window.localStorage.getItem("token"));
      param.append("page", val);
      const { data: data } = await this.$http.post("speak/index", param);
      console.log(data);
      this.tableData = data.data.list;
    },
    /* 首屏数据获取 */
    async speaker() {
      let param = new URLSearchParams();
      param.append("token", window.localStorage.getItem("token"));
      param.append("page", this.page);
      const { data: data } = await this.$http.post("speak/index", param);
      console.log(data);
      this.tableData = data.data.list;
      this.count = data.data.count_users;
      this.size = data.data.list.length;
    },
    /* 点击编辑按钮跳转 携带数据 */
    handleClose(done) {
      done();
    },
    /* 点击编辑按钮 */
    async edit(id) {
      this.dialogVisible = true;
      let param = new URLSearchParams();
      param.append("sid", id);
      param.append("token", window.localStorage.getItem("token"));
      const { data: data } = await this.$http.post("speak/edit", param);
      if (data.code != 1) {
        this.$message({
          type: "error",
          message: data.msg
        });
        return false;
      }
      let tmpToken = this.ruleForm.token;
      this.ruleForm = data.data;
      this.ruleForm.token = tmpToken;
      this.fileList[0].url = data.data.speak_avatar;
      this.page = 1;
      console.log(data, "打开编辑获取表格数据");
    },
    /* 点击编辑弹出框确认按钮 */
    editEnter() {
      this.ruleForm.token = window.localStorage.getItem("token");
      var p = this.$param(this.ruleForm);
      this.$refs.editForm.validate(async valid => {
        if (!valid) return;
        const { data: data } = await this.$http.post("speak/editPost", p);
        console.log(data);
        if (data.code != 1) {
          this.$message({
            type: "error",
            message: "请至少修改一项"
          });
        } else {
          this.dialogVisible = false;
          this.page = 1;
          this.speaker();
        }
      });
    },
    // 点击删除
    async delete_(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该条数据, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmResult !== "confirm") {
        return this.$message({
          type: "info",
          message: "已取消删除"
        });
      }
      let param = new URLSearchParams();
      param.append("sid", id);
      param.append("token", window.localStorage.getItem("token"));
      const { data: data } = await this.$http.post("speak/del", param);
      if (data.code != 1) return this.$message.error("删除用户失败！");
      this.$message.success("删除用户成功！");
      this.speaker();
      this.page = 1;
    },
    /* 上传头像  */
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    success(response, file, fileList) {
      console.log(file);
      this.ruleForm.speak_avatar = file.response.data.url;
    },
    error() {},
    /* 上传图片进行限制 */
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
          this.ruleForm.speak_avatar = imgurl;
          this.fileList[0].url = imgurl;
        }
      });
    }
  }
};
</script>
<style scoped>
.el-pagination {
  margin-top: 30px;
}
</style>
