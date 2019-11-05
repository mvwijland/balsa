<template>
  <el-container>
    <el-container>
      <el-aside width="fit-content">
        <SideBar @handler="selectedIndex" />
      </el-aside>
      <el-container>
        <el-main class="main">
          <Main
            :selectedCategory="index"
            @handler="selectedCard"
            :selectedCard="card"
            :class="!activeAnim?'opacity':'no-opacity'"
          />
        </el-main>
      </el-container>
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
      activeAnim: false,
    };
  },
  methods: {
    selectedCard(data) {
      // selected card's object holds in here.
      this.$emit('handler', data);
      this.card = data;
    },
    selectedIndex(index) {
      console.log('index', index);
      this.activeAnim = true;
      setTimeout(() => (this.activeAnim = false), 150);

      //selected data comes from Sidebar component.
      // Once the data declared. We are holding a copy of it.
      // And we are passing the copy to the other Components
      this.index = index;

      //once selected category changed. Selected card needs to be an empty.
      this.card = null;
      this.$emit('handler', null);
    },
  },
};
</script>

<style scoped>
.main {
  padding: 0px 48px;
  max-height: 500px;
  overflow: auto;
}
.opacity {
  opacity: 1;
  transition: all 0.3s;
}
.no-opacity {
  opacity: 0;
}
</style>