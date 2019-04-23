<template>
  <div class="container">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <div class="input_box">
      <span>昵称</span>
      <el-input v-model="searchs.nick_name" placeholder="昵称"></el-input>
      <span>手机号</span>
      <el-input
        v-model="searchs.mobile"
        placeholder="手机号"
        type="tel"
      ></el-input>
      <!--             onkeyup="value=value.replace(/[\u4e00-\u9fa5]/ig,'')" -->
      <el-button type="primary" icon="el-icon-search" @click="search"
        >搜索</el-button
      >
      <el-button type="primary" @click="addUser">新增</el-button>
      <el-button type="primary" style="position:relative"
        >批量导入
        <input
          id="upload"
          type="file"
          @change="importfxx(this)"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          style="position:absolute;left:0;top:0;width:56px;height:14px;padding: 12px 20px;opacity:0;"
        />
      </el-button>
      <el-button type="primary" style="position:relative" @click="downLoad"
        >下载模板</el-button
      >
      <span>{{ htmlmsg }}</span>
    </div>
    <!-- TODO  弹出框-->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item
          label="用户名"
          :label-width="formLabelWidth"
          prop="user_name"
        >
          <el-input
            v-model="form.user_name"
            autocomplete="off"
            placeholder="请输入用户名(数字+字母)"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth" prop="sex">
          <el-select v-model="form.sex" placeholder="请选择性别">
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="手机号码"
          :label-width="formLabelWidth"
          prop="mobile"
        >
          <el-input
            v-model="form.mobile"
            autocomplete="off"
            type="phone"
            placeholder="请输入手机号码"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogcancle">取 消</el-button>
        <el-button type="primary" @click="dialogEnter">确 定</el-button>
      </div>
    </el-dialog>
    <!-- TODO -->
    <!-- 表格展示数据 -->
    <el-table :data="tableData" border stripe>
      <el-table-column prop="id" label="ID" align="center" width="80"> </el-table-column>
      <el-table-column prop="user_name" label="用户名" align="center">
        <!-- <template slot-scope="scope">
          {{ scope.row.date | dateFormat }}
        </template> -->
      </el-table-column>
      <el-table-column prop="nick_name" label="昵称" align="center"  width="200"> </el-table-column>
      <el-table-column prop="branch" label="部门" align="center" width="200"> </el-table-column>
      <el-table-column prop="男" label="性别" :formatter="formatSex" align="center"  width="200">
      </el-table-column>
      <el-table-column prop="mobile" label="手机号码" align="center"> </el-table-column>
      <el-table-column prop="address" label="操作" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="medium" @click="edit(scope.row.id)"
            >编辑</el-button
          >
          <el-button type="primary" size="danger" @click="delete_(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 点击编辑弹出对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogEditVisible"
      :before-close="handleClose"
    >
      <el-form
        :model="editForm"
        :rules="editRules"
        ref="editForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-input v-model="editForm.id" type="hidden"></el-input>
        <el-form-item label="用户名" prop="user_name">
          <el-input v-model="editForm.user_name"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nick_name">
          <el-input v-model="editForm.nick_name"></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="branch">
          <el-input v-model="editForm.branch"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-input v-model="editForm.sex"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false">取 消</el-button>
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
      layout="total,sizes, prev, pager, next, jumper"
      :total="count"
    >
    </el-pagination>
  </div>
</template>
<script>
export default {
  data() {
    return {
      htmlmsg: "",
      page: 1,
      count: 0,
      size: 0,
      str: "",
      /* 搜索框v-model绑定的数据 */
      searchs: {
        nick_name: "",
        mobile: "",
        token: window.localStorage.getItem("token")
      },
      /* 展示数据 */
      tableData: [
        {
          id: "",
          user_name: "",
          nick_name: "",
          sex: "",
          mobile: "",
          branch: "",
          token: window.localStorage.getItem("token")
        }
      ],
      /* 编辑数据 */
      editForm: {
        id: "",
        user_name: "",
        nick_name: "",
        sex: "",
        mobile: "",
        branch: "",
        token: window.localStorage.getItem("token")
      },
      /* 新增数据 */
      form: {
        user_name: "",
        sex: "",
        mobile: "",
        token: window.localStorage.getItem("token")
      },
      /* 新增表单布尔 */
      dialogFormVisible: false,
      /* 编辑表单布尔 */
      dialogEditVisible: false,
      /* 新增的弹出框规则 */
      rules: {
        user_name: [
          {
            required: true,
            message: "请输入用户名(英文+字母)",
            trigger: "blur"
          }
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "change" }],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { min: 11, max: 11, message: "请输入正确的手机号码", trigger: "blur" }
        ]
      },
      /* 编辑的弹出框规则 */
      editRules: {
        user_name: [
          {
            required: true,
            message: "请输入用户名(英文+字母)",
            trigger: "blur"
          }
        ],
        nick_name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        sex: [{ required: true, message: "请输入性别", trigger: "blur" }],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" }
        ],
        branch: [{ required: true, message: "请输入部门", trigger: "blur" }]
      },
      formLabelWidth: "120px"
    };
  },
  created() {
    this.userList();
  },
  methods: {
    /* 列表获取 */
    async userList() {
      let param = new URLSearchParams();
      param.append("token", window.localStorage.getItem("token"));
      const { data: data } = await this.$http.post("users/index", param);
      if (data.code != 1) {
        this.$message({
          type: "error",
          message: data.msg
        });
        return false;
      }
      this.count = data.data.count_users;
      this.tableData = data.data.list;
      this.size = data.data.list.length;
    },
    /* 关闭编辑dialog */
    handleClose(done) {
      done();
    },
    /* 关闭新增的dialog */
    dialogcancle() {
      this.dialogFormVisible = false;
      this.form.user_name = "";
      this.form.sex = "";
      this.form.mobile = "";
    },
    /* 性别格式化 */
    formatSex: function(row, column) {
      return row.sex == 1 ? "男" : row.sex == 2 ? "女" : "";
    },
    /* excel表格导入 */
    importfxx(obj) {
      let _this = this;
      let inputDOM = this.$refs.inputer;
      // 通过DOM取文件数据
      this.file = event.currentTarget.files[0];
      var rABS = false; //是否将文件读取为二进制字符串
      var f = this.file;
      var reader = new FileReader();
      if (f == "" || f == undefined) {
        this.htmlmsg = "";
        this.$message({
          type: "warning ",
          message: "没有选择文件"
        });
        return false;
      }
      this.htmlmsg = f.name;
      FileReader.prototype.readAsBinaryString = function(f) {
        var binary = "";
        var rABS = false; //是否将文件读取为二进制字符串
        var pt = this;
        var wb; //读取完成的数据
        var outdata;
        var reader = new FileReader();
        reader.onload = function(e) {
          var bytes = new Uint8Array(reader.result);
          var length = bytes.byteLength;
          for (var i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          var XLSX = require("xlsx");
          if (rABS) {
            wb = XLSX.read(btoa(fixdata(binary)), {
              //手动转化
              type: "base64"
            });
          } else {
            wb = XLSX.read(binary, {
              type: "binary"
            });
          }
          outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]); //outdata就是你想要的东西
          var str = JSON.stringify(outdata);
          if (str != "") {
            _this.str = str;
            _this.addAll();
          }
        };
        reader.readAsArrayBuffer(f);
      };
      if (rABS) {
        reader.readAsArrayBuffer(f);
      } else {
        reader.readAsBinaryString(f);
      }
    },
    /* 批量导入 */
    async addAll() {
      let param = new URLSearchParams();
      param.append("users", this.str);
      param.append("token", window.localStorage.getItem("token"));
      const { data: data } = await this.$http.post("users/addAll", param);
      if (data.code != 1) {
        this.$message({
          type: "error",
          message: "添加失败1"
        });
      } else {
        this.$message({
          type: "success",
          message: "成功"
        });
        this.userList();
      }
    },
    /* 点击添加按钮 */
    addUser() {
      this.dialogFormVisible = true;
    },
    /* 下载excel表模板 */
    downLoad() {
      window.location.href = this.$config.url + "/muban.xlsx";
    },

    /* 点击添加确认按钮 */
    dialogEnter() {
      var p = this.$param(this.form);
      var name = this.form.user_name;
      var reg = /[\u4E00-\u9FA5]/g;
      if (reg.test(name)) {
        this.$message({
          type: "error",
          message: "用户名不能输入中文汉字"
        });
        this.form.user_name = "";
      } else {
        this.$refs.ruleForm.validate(async valid => {
          if (!valid) return;

          const { data: data } = await this.$http.post("users/addPost", p);
          if (data.code != 1) {
            this.$message({
              type: "error",
              message: "添加失败,该用户已注册"
            });
          } else {
            this.form.user_name = "";
            this.form.sex = "";
            this.form.mobile = "";
            this.dialogFormVisible = false;
            this.userList();
            this.page = 1;
          }
        });
      }
    },
    /* 点击编辑 */
    async edit(id) {
      this.dialogEditVisible = true;
      let param = new URLSearchParams();
      param.append("id", id);
      param.append("token", window.localStorage.getItem("token"));
      const { data: data } = await this.$http.post("/users/edit", param);
      if (data.code != 1) {
        this.$message({
          type: "error",
          message: data.msg
        });
        return false;
      }
      this.editForm = data.data;
      if (this.editForm.sex == 1) {
        this.editForm.sex = "男";
      } else {
        this.editForm.sex = "女";
      }
    },
    /* 点击编辑确认 */
    editEnter() {
      /* TODO */
      var params = {
        id: "",
        user_name: "",
        nick_name: "",
        sex: "",
        mobile: "",
        branch: "",
        token: window.localStorage.getItem("token")
      };
      params.id = this.editForm.id;
      params.user_name = this.editForm.user_name;
      params.nick_name = this.editForm.nick_name;
      // params.sex = this.editForm.sex;
      params.mobile = this.editForm.mobile;
      params.branch = this.editForm.branch;
      if (this.editForm.sex == "男") {
        params.sex = 1;
      } else if (this.editForm.sex == "女") {
        params.sex = 2;
      }
      this.$refs.editForm.validate(async valid => {
        var p = this.$param(params);
        if (!valid) return;
        const { data: data } = await this.$http.post("users/editPost", p);
        if (data.code != 1) {
          this.$message({
            type: "error",
            message: "请至少修改一项"
          });
        } else {
          this.dialogEditVisible = false;
          this.userList();
          this.page = 1;
        }
      });
    },
    // 搜索功能 ok
    async search() {
      let param = new URLSearchParams();
      if (this.searchs.nick_name != "" && this.searchs.mobile != "") {
        param.append("nick_name", this.searchs.nick_name);
        param.append("mobile", this.searchs.mobile);
        param.append("token", window.localStorage.getItem("token"));
      } else if (this.searchs.nick_name != "") {
        param.append("nick_name", this.searchs.nick_name);
        param.append("token", window.localStorage.getItem("token"));
      } else {
        param.append("mobile", this.searchs.mobile);
        param.append("token", window.localStorage.getItem("token"));
      }
      const { data: data } = await this.$http.post("users/index", param);
      if (data.code != 1) {
        this.$message({
          type: "error",
          message: data.msg
        });
      } else {
        this.tableData = data.data.list;
      }
    },
    handleSizeChange(val) {},
    /* 分页 */
    async handleCurrentChange(val) {
      this.page = val;
      let param = new URLSearchParams();
      param.append("page", val);
      param.append("token", window.localStorage.getItem("token"));
      const { data: data } = await this.$http.post("users/index", param);
      this.tableData = data.data.list;
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
      param.append("id", id);
      param.append("token", window.localStorage.getItem("token"));
      const { data: data } = await this.$http.post("users/del", param);
      if (data.code != 1) return this.$message.error("删除用户失败！");
      this.$message.success("删除用户成功！");
      this.userList();
      this.page = 1;
    }
  }
};
</script>
<style scoped>
.upload-demo,
.el-upload-list {
  display: inline-block !important;
}

.input_box .el-input {
  width: 200px;
  margin-bottom: 20px;
  margin-right: 20px;
}
.el-button {
  margin: 0 20px;
}
.el-dialog .el-input {
  width: 80%;
}
</style>

