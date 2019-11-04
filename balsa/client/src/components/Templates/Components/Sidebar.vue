<template>
  <el-row class="tac">
    <el-col :span="24">
      <el-menu
        default-active="1"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        style="height:calc(100vh - 60px);"
        @close="handleClose"
      >
        <el-menu-item index="1">
          <i class="el-icon-menu"></i>
          <span>Design</span>
        </el-menu-item>
        <el-menu-item index="2">
          <i class="el-icon-menu"></i>
          <span>Engineering</span>
        </el-menu-item>
        <el-menu-item index="3">
          <i class="el-icon-menu"></i>
          <span>Human resources</span>
        </el-menu-item>
        <el-menu-item index="4">
          <i class="el-icon-menu"></i>
          <span>Marketing</span>
        </el-menu-item>
        <el-menu-item index="5">
          <i class="el-icon-menu"></i>
          <span>Meetings</span>
        </el-menu-item>
        <el-menu-item index="6">
          <i class="el-icon-menu"></i>
          <span>Miscellaneous</span>
        </el-menu-item>
        <el-menu-item index="7">
          <i class="el-icon-menu"></i>
          <span>Product</span>
        </el-menu-item>
        <el-menu-item index="8">
          <i class="el-icon-menu"></i>
          <span>Sales</span>
        </el-menu-item>
        <el-menu-item index="9">
          <i class="el-icon-menu"></i>
          <span>Support</span>
        </el-menu-item>

        <!-- <div style="padding:20px;margin-bottom:90px">
          <el-card shadow="always" class="tips">
            <el-row style="margin-bottom:8px;">
              <span>Show Tips</span>
            </el-row>
            <el-row
              style="margin-bottom:8px;"
            >show somoe display texts here ! it may be usefull the show some tips to user.</el-row>
            <el-row>this is going to be an dummy data.</el-row>
          </el-card>
        </div>-->
      </el-menu>
    </el-col>
  </el-row>
</template>

<script>
export default {
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
  },
};
</script>

<style>
</style>