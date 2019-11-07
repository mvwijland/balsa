<template>
  <el-col :xl="8" :lg="8" :md="10">
    <el-row
      class="template--card"
      :class="selectedCard && selectedCard.id === data.id ? 'selected-card' : null"
    >
      <el-row style="padding:8px 0">
        <div class="template-image template-holder" v-html="data.contentHtml"></div>
      </el-row>
      <el-col>
        <el-row class="card-container" type="flex" align="middle">
          <Avatar />
          <span
            class="medium-font-weight small-text-color medium-font"
            style="margin-left:8px;word-break: break-word;"
          >{{data.name}}</span>
        </el-row>
      </el-col>
    </el-row>
  </el-col>
</template>

<script>
import Avatar from '../../Avatar';
export default {
  props: {
    data: {
      type: Object,
      default: { id: -1 },
    },
    selectedCard: {
      type: Object,
      default: { id: -2 },
    },
  },
  methods: {},
  components: {
    Avatar,
  },
};
</script>

<style>
.template--card {
  margin-top: 36px;
  cursor: pointer;
}
.card-container {
  width: 100%;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  padding-left: 22px;
  padding-right: 22px;
  z-index: 1;
  position: relative;
  background: white;
  top: 0;
  transition: all 0.5s;
  height: 94px;
}
/* .template--card:hover .card-container {
  transition: all 0.5s;
  top: -20px;
  border-radius: 0;
  border-color: white;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.template--card:hover .template-image {
  transition: all 0.5s;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
} */
.template-image {
  height: 240px;
  width: 100%;
  padding: 24px;
  overflow: hidden;
  background: #f9f9f9;
  border-radius: 4px;
}
.selected-card .card-container {
  transition: all 0.5s;
  top: -20px;
  border-radius: 0;
  border-color: white;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.selected-card .template-image {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}
</style>