<template>
  <el-row class="bottom-template-menu" type="flex" justify="end">
    <el-button
      :disabled="selectedCard?false:true"
      style="padding-left:48px;padding-right:48px;"
      type="primary"
    >Create</el-button>
  </el-row>
</template>

<script>
export default {
  props: {
    selectedCard: { type: Object },
  },
};
</script>

<style scoped>
.bottom-template-menu {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 1;
  background-color: white;
  border-top: solid 1px #e6e6e6;
  padding: 24px 63px;
}
</style>