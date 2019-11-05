<template>
  <el-row class="tac">
    <el-col :span="24">
      <el-menu
        :collapse="isMobile()? true:false"
        @select="handleSelect"
        default-active="design"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
      >
        <el-menu-item index="design">
          <i class="el-icon-menu"></i>
          <span>Design</span>
        </el-menu-item>
        <el-menu-item index="engineer">
          <i class="el-icon-menu"></i>
          <span>Engineering</span>
        </el-menu-item>
        <el-menu-item index="human">
          <i class="el-icon-menu"></i>
          <span>Human resources</span>
        </el-menu-item>
        <el-menu-item index="marketing">
          <i class="el-icon-menu"></i>
          <span>Marketing</span>
        </el-menu-item>
        <el-menu-item index="meetings">
          <i class="el-icon-menu"></i>
          <span>Meetings</span>
        </el-menu-item>
        <el-menu-item index="miscellaneous">
          <i class="el-icon-menu"></i>
          <span>Miscellaneous</span>
        </el-menu-item>
        <el-menu-item index="product">
          <i class="el-icon-menu"></i>
          <span>Product</span>
        </el-menu-item>
        <el-menu-item index="sales">
          <i class="el-icon-menu"></i>
          <span>Sales</span>
        </el-menu-item>
        <el-menu-item index="support">
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
    isMobile() {
      try {
        if (
          /Android|webOS|iPhone|iPad|iPod|pocket|psp|kindle|avantgo|blazer|midori|Tablet|Palm|maemo|plucker|phone|BlackBerry|symbian|IEMobile|mobile|ZuneWP7|Windows Phone|Opera Mini/i.test(
            navigator.userAgent,
          )
        ) {
          return true;
        }
        return false;
      } catch (e) {
        console.log('Error in isMobile');
        return false;
      }
    },
    handleSelect(index) {
      this.$emit('handler', index);
    },
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