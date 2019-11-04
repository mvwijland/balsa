<template>
  <el-container>
    <Header />
    <el-container style="margin-top:60px;">
      <el-aside>
        <SideBar />
      </el-aside>
      <el-container>
        <el-main class="main">
          <Main />
        </el-main>
      </el-container>
      <BottomMenu />
    </el-container>
  </el-container>
</template>

<script>
import Header from '../Headers/HomeHeader';
import BottomMenu from './Components/BottomMenu';
import Main from './Components/Main';
import SideBar from './Components/Sidebar';
export default {
  components: {
    SideBar,
    Main,
    BottomMenu,
    Header,
  },
};
</script>

<style scoped>
.main {
  padding: 0px 48px 48px 48px;
  max-height: calc(100vh - 60px);
  overflow: auto;
}
</style>