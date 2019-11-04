<template>
  <el-container>
    <el-container>
      <el-aside width="200px">
        <SideBar @handler="selectedIndex" />
      </el-aside>
      <el-container>
        <el-main class="main">
          <Main :selectedCategory="index" @handler="selectedCard" :selectedCard="card" />
        </el-main>
      </el-container>
      <BottomMenu :selectedCard="card" />
    </el-container>
  </el-container>
</template>

<script>
import BottomMenu from './Components/BottomMenu';
import Main from './Components/Main';
import SideBar from './Components/Sidebar';
export default {
  components: {
    SideBar,
    Main,
    BottomMenu,
  },
  data() {
    return {
      index: 'design',
      card: null,
    };
  },
  methods: {
    selectedCard(data) {
      // selected card's object holds in here.
      this.card = data;
    },
    selectedIndex(index) {
      //selected data comes from Sidebar component.
      // Once the data declared. We are holding a copy of it.
      // And we are passing the copy to the other Components
      this.index = index;

      //once selected category changed. Selected card needs to be an empty.
      this.card = null;
    },
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