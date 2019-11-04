<template>
  <el-row :gutter="48" style=";margin-bottom:90px">
    <TemplateCard v-for="(card,index) in arr" :key="index" :data="card" />
  </el-row>
</template>

<script>
import TemplateCard from './TemplateCard';
export default {
  components: {
    TemplateCard,
  },
  data() {
    return {
      arr: [
        { title: 'Tasks & Issues' },
        { title: 'Meeting notes' },
        { title: 'Product specifications' },
        { title: 'Vision & mission' },
        { title: 'Weekly reviews' },
        { title: 'Product management' },
        { title: 'Tasks & Issues' },
        { title: 'Tasks & Issues' },
        { title: 'Tasks & Issues' },
        { title: 'Tasks & Issues' },
        { title: 'Tasks & Issues' },
        { title: 'Tasks & Issues' },
        { title: 'Tasks & Issues' },
        { title: 'Tasks & Issues' },
      ],
    };
  },
};
</script>

<style>
</style>