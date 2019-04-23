<template>
  <!-- 病种列表 -->
  <div class="container">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>素材管理</el-breadcrumb-item>
      <el-breadcrumb-item>病例列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  -->
    <div class="input_box">
      <span>名称</span>
      <el-input v-model="name" placeholder="请输入名称"></el-input>
      <!-- 下拉框 -->
      <el-select v-model="speak_name" placeholder="请选择讲者">
        <el-option
          v-for="item in speaker"
          :key="item.sid"
          :label="item.speak_name"
          :value="item.sid"
        ></el-option>
      </el-select>
      <el-select v-model="post_type" placeholder="请选择病种">
        <el-option label="糖尿病" value="1"></el-option>
        <el-option label="痛风/高尿酸血症" value="2"></el-option>
        <el-option label="甲状腺疾病" value="3"></el-option>
      </el-select>
      <el-button
        type="primary"
        icon="el-icon-search"
        style="margin-left:10px;"
        @click="search"
        >搜索</el-button
      >
    </div>
    <div>
      <el-button
        type="primary"
        icon="el-icon-edit"
        style="margin-bottom:20px;"
        @click="navigate"
        >添加</el-button
      >
    </div>
    <!-- 表格展示数据 -->
    <el-table :data="tableData" border stripe>
      <el-table-column prop="id" label="ID" align="center"> </el-table-column>
      <el-table-column prop="post_title" label="标题" align="center">
      </el-table-column>
      <el-table-column prop="speak_name" label="讲者" align="center">
      </el-table-column>
      <el-table-column
        prop="name"
        label="病种"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="post_like"
        label="票数"
        align="center"
      ></el-table-column>
      <el-table-column prop="is_qiyong" label="是否显示" align="center">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.is_qiyong == 1">显示</el-tag>
          <el-tag type="danger" v-else>不显示</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="创建时间" align="center">
        <template slot-scope="scope">
          {{ (scope.row.create_time * 1000) | dateFormat }}
        </template></el-table-column
      >
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
export default {
  data() {
    return {
      count: 0,
      size: 0,
      is_qiyong: null,
      order_type: 2,
      page: 1,
      token: window.localStorage.getItem("token"),
      tableData: [],
      speaker: [],
      post_type: "",
      speak_name: "",
      name: ""
    };
  },
  created() {
    this.case_list();
    this.speaker_list();
  },
  methods: {
    navigate() {
      this.$router.push("/cases_detail");
    },
    handleClose(done) {
      done();
    },
    handleClose1(done) {
      done();
    },
    /* 获取讲者列表 */
    async speaker_list() {
      let param = new URLSearchParams();
      param.append("order_type", this.order_type);
      param.append("token", window.localStorage.getItem("token"));
      const { data: data } = await this.$http.post("speak/getSpeakList", param);
      this.speaker = data.data;
    },
    /* 搜索 */
    async search() {
      let param = new URLSearchParams();
      if (this.name != "") {
        param.append("keyword", this.name);
      }
      if (this.speak_name != "") {
        param.append("speak_id", this.speak_name);
      }
      if (this.post_type != "") {
        param.append("post_type", this.post_type);
      }
      param.append("order_type", this.order_type);
      param.append("page", this.page);
      param.append("token", window.localStorage.getItem("token"));
      const { data: data } = await this.$http.post("case/index", param);
      this.tableData = data.data.list;
    },
    handleSizeChange(val) {},
    /* 分页功能 */
    async handleCurrentChange(val) {
      this.page = val;
      let param = new URLSearchParams();
      param.append("page", val);
      param.append("order_type", 2);
      param.append("token", window.localStorage.getItem("token"));
      const { data: data } = await this.$http.post("case/index", param);
      this.tableData = data.data.list;
    },
    /* 病例列表渲染 */
    async case_list() {
      let param = new URLSearchParams();
      param.append("page", this.page);
      param.append("order_type", this.order_type);
      param.append("token", window.localStorage.getItem("token"));
      const { data: data } = await this.$http.post("case/index", param);
      if (data.code != 1) {
        this.$message({
          type: "error",
          message: "获取病例列表失败!"
        });
      }
      this.tableData = data.data.list;
      this.count = data.data.count_users;
      this.size = data.data.list.length;
    },
    /* 点击编辑 */
    async edit(id) {
      this.$router.push("/cases_detail_edit?id=" + id);
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
      const { data: data } = await this.$http.post("case/del", param);
      if (data.code != 1) return this.$message.error("删除用户失败！");
      this.$message.success("删除用户成功！");
      this.case_list();
      this.page = 1;
    }
  }
};
</script>
<style scoped>
.input_box .el-input {
  width: 200px;
  margin-bottom: 20px;
  margin-right: 20px;
}

.el-dropdown {
  vertical-align: top;
}

.el-dropdown + .el-dropdown {
  margin-left: 15px;
}

.el-icon-arrow-down {
  font-size: 12px;
}

.el-pagination {
  margin-top: 30px;
}
</style>
