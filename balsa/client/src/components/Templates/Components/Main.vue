<template>
  <el-row :gutter="36">
    <TemplateCard
      :data="card"
      v-for="card in templates"
      v-if="!$apollo.queries.templates.loading"
      :key="card.id"
      :selectedCard="selectedCard"
      @click.native="selectedCard !==card ? $emit('handler',card) : $emit('handler',null)"
    />
  </el-row>
</template>

<script>
import TemplateCard from './TemplateCard';
import {TEMPLATES_QUERY} from "../../../queries";
export default {
  props: {
    selectedCategory: {
      type: Number,
      default: 0
    },
    selectedCard: {
      type: Object,
      default: {},
    },
  },
  components: {
    TemplateCard,
  },
  apollo: {
    templates: {
      query: TEMPLATES_QUERY,
      variables() {
        return {
          categoryId: this.selectedCategory ? this.selectedCategory : null
        };
      },
    },
  },
};
</script>

<style>
</style>