<template>
  <el-container class="home">
    <!-- 头部 -->
    <el-header>
      <div>
        <img class="header-img"
             src="../../assets/heima.png"
             alt="" />
        <span class="text">后台管理系统</span>
      </div>
      <el-button :plain="true"
                 type="info"
                 @click="logOut">退出</el-button>
    </el-header>
    <el-container>
      <!-- 左侧边栏 -->
      <el-aside :width="isShow ? '64px':'200px'">
        <div class="aside-item"
             @click="changeAside">|||</div>
        <el-menu background-color="#373d41"
                 text-color="#fff"
                 :unique-opened='true'
                 :collapse='isShow'
                 :collapse-transition='false'
                 router
                 @select='handleOpen'
                 :default-active='defaultPath'>
          <!-- default-active 把想要高亮显示的某一菜单index值赋值给它即可 -->
          <el-submenu :index="item.id+''"
                      v-for="(item) in menuList"
                      :key="item.id">
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="k.path+''"
                          active-text-color="#ffd04b"
                          v-for="k in item.children"
                          :key='k.id'
                          @click="hanleClick(k.path)">
              <i class="el-icon-menu"></i>
              <span slot="title">{{k.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体内容 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
export default {
  data () {
    return {
      menuList: [],
      iconObj: {
        '125': 'iconfont icon-users',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpingouwudai2',
        '102': 'iconfont icon-danju-tianchong',
        '145': 'iconfont icon-baobiao',
      },
      isShow: false,
      defaultPath: ''
    }
  },
  created () {
    let path = sessionStorage.getItem('path')
    this.defaultPath = path
  },
  mounted () {
    this.getMenus()
  },
  methods: {
    //退出系统
    logOut () {
      window.sessionStorage.clear()
      this.$message({ message: '退出成功', duration: 1000 })
      this.$router.replace('/login')
    },
    //获取侧边栏列表信息
    async getMenus () {
      const { data: res } = await this.$http.get('/menus')
      if (res.meta.status !== 200) return this.$message.error('获取列表失败')
      console.log(res);
      this.menuList = res.data
    },
    //点击伸缩展示侧边栏
    changeAside () {
      this.isShow = !this.isShow
    },
    //展开指定的 sub-menu
    handleOpen (index, indexPath) {
      console.log(index, indexPath);
    },
    hanleClick (path) {
      sessionStorage.setItem('path', path)
      //点击列表时并没有高亮显示
      this.defaultPath = path
    }
  },
}
</script>

<style lang="less" scoped>
.home {
  height: 100%;
}
.el-button {
  background-color: #999;
  color: #fff;
}
.el-header,
.el-aside {
  background-color: #373d41;
  .aside-item {
    text-align: center;
    color: #fff;
    letter-spacing: 0.2em;
    cursor: pointer;
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
  }
}
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
}
.el-main {
  background-color: #eaedf1;
}
.el-menu {
  border: none;
}
.header-img {
}
.el-header div {
  display: flex;
  align-items: center;
}
.text {
  font-size: 20px;
  padding-left: 10px;
}
.iconfont {
  padding-right: 15px;
}
</style>