<template>
  <el-container class="container">
    <el-header>
      <div class="logo-box">
        <img src="../../assets/images/logo.png" alt="" />
        <span style="font-size:20px;">美敦力后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="collapse ? '65px' : '200px'">
        <div class="toggle_bar" @click="collapse = !collapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opened="true"
          :collapse="collapse"
          :collapse-transition="false"
          :router="true"
        >
          <!-- 子菜单 -->
          <el-submenu
            :style="collapse ? 'width: 65px;' : 'width: 200px;'"
            index="1"
          >
            <template slot="title">
              <i :class="['iconfont', iconList[5]]"></i>
              <span>系统设置</span>
            </template>
          </el-submenu>
          <el-submenu
            :style="collapse ? 'width: 65px;' : 'width: 200px;'"
            index="2"
          >
            <template slot="title">
              <i :class="['iconfont', iconList[0]]"></i>
              <span>用户管理</span>
            </template>
            <!-- 子菜单的 Item 项 -->
            <!-- 如果要为 el-menu-item 开启路由模式,需要 通过 index 属性,作为路由要跳转的地址 -->
            <el-menu-item :index="'/' + 'User'">
              <i class="el-icon-menu"></i>
              <span>用户列表</span>
            </el-menu-item>
            <el-menu-item :index="'/' + 'Speaker'">
              <i class="el-icon-menu"></i>
              <span>讲者列表</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu
            :style="collapse ? 'width: 65px;' : 'width: 200px;'"
            index="3"
          >
            <template slot="title">
              <i :class="['iconfont', iconList[1]]"></i>
              <span>素材管理</span>
            </template>
            <el-menu-item :index="'/' + 'Cases'">
              <i class="el-icon-menu"></i>
              <span>病例列表</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      collapse: false,
      iconList: [
        "icon-users",
        "icon-tijikongjian",
        "icon-shangpin",
        "icon-danju",
        "icon-baobiao",
        "icon-shezhi"
      ]
    };
  },
  methods: {
    logout() {
      window.localStorage.removeItem("token");
      this.$router.push("/");
    }
  }
};
</script>
<style scoped>
.container {
  height: 100%;
}
.el-header {
  height: 60px;
  background: #373d41;
  line-height: 60px;
  color: #fff;
  display: flex;
  justify-content: space-between;
}
.logo-box {
  display: flex;
}
img {
  width: 120px;
  height: 40px;
  margin-right: 20px;
  margin-top: 10px;
}
.el-aside {
  user-select: none;
  background: #333744;
}
.el-button {
  height: 40px;
  margin-top: 10px;
}
.el-main {
  background-color: #eaedf1;
  user-select: none;
}
.toggle_bar {
  color: #fff;
  font-size: 12px;
  text-align: center;
  line-height: 25px;
  background-color: #4a5064;
  user-select: none;
  cursor: pointer;
  letter-spacing: 0.1em;
}
</style>
