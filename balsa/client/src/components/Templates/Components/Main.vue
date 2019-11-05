<template>
  <el-row :gutter="48">
    <div
      v-on:click="selectedCard !==card ? $emit('handler',card):$emit('handler',null);"
      v-for="(card,index) in arr.filter(a=>a.category===selectedCategory)"
      :key="index"
    >
      <TemplateCard :data="card" :selectedCard="selectedCard" />
    </div>
  </el-row>
</template>

<script>
import TemplateCard from './TemplateCard';
export default {
  props: {
    selectedCategory: { type: String, default: 'design' },
    selectedCard: {
      tpye: Object,
      default: {},
    },
  },
  components: {
    TemplateCard,
  },
  data() {
    return {
      arr: [
        { id: '1', title: 'Tasks & Issues', category: 'design' },
        { id: '2', title: 'Meeting notes', category: 'design' },
        { id: '3', title: 'Product specifications', category: 'engineer' },
        { id: '4', title: 'Vision & mission', category: 'engineer' },
        { id: '5', title: 'Weekly reviews', category: 'engineer' },
        { id: '6', title: 'Product management', category: 'engineer' },
        { id: '7', title: 'Tasks & Issues', category: '3' },
        { id: '8', title: 'Tasks & Issues', category: '3' },
        { id: '9', title: 'Tasks & Issues', category: '4' },
        { id: '10', title: 'Tasks & Issues', category: '5' },
        { id: '11', title: 'Tasks & Issues', category: '6' },
        { id: '12', title: 'Tasks & Issues', category: '7' },
        { id: '13', title: 'Tasks & Issues', category: '8' },
        { id: '14', title: 'Tasks & Issues', category: '9' },
      ],
    };
  },
};
</script>

<style>
</style>