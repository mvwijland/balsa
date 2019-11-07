<template>
  <el-row class="tac full-height">
    <el-col :span="24" class="full-height">
      <el-menu
        :collapse="isMobile()? true:false"
        @select="handleSelect"
        default-active="design"
        class="el-menu-vertical-demo full-height"
        @open="handleOpen"
        @close="handleClose"
      >
        <el-menu-item
          v-for="category in templateCategories"
          v-if="!$apollo.queries.templateCategories.loading"
          :index="category.id"
        >
          <i class="el-icon-menu"></i>
          <span>{{ category.name }}</span>
        </el-menu-item>

        <!-- <div style="padding:20px;margin-bottom:90px">
          <el-card shadow="always" class="tips">
            <el-row style="margin-bottom:8px;">
              <span>Show Tips</span>
            </el-row>
            <el-row
              style="margin-bottom:8px;"
            >show some display texts here ! it may be useful the show some tips to user.</el-row>
            <el-row>this is going to be an dummy data.</el-row>
          </el-card>
        </div>-->
      </el-menu>
    </el-col>
  </el-row>
</template>

<script>
import { TEMPLATE_CATEGORIES_QUERY } from '../../../queries';

export default {
  apollo: {
    templateCategories: {
      query: TEMPLATE_CATEGORIES_QUERY,
    },
  },
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