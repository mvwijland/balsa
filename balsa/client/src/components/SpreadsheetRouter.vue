<template>
  <el-container>
    <EditorHeader />
    <Main class="sub-main balsa-header-bg">
      <Spreadsheet ref="spreadsheet" />
    </Main>
  </el-container>
</template>

<script>
  import EditorHeader from './Headers/EditorHeader.vue';
  import Spreadsheet from './Spreadsheet.vue';
  import Main from './Main.vue';
  export default {
    name: 'SpreadsheetRouter',
    components: { EditorHeader, Main, Spreadsheet },
    props: {
      msg: String,
    },
  };
</script>
