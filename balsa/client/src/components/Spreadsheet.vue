<template>
  <el-row>
    <AddToFolderDialog
      :dialogVisible="$store.getters.isMoveDialogOpen"
      class="no-print"
      @handler="$store.dispatch('toggleMoveDialog')"
      :file="Spreadsheet"
      v-if="!this.$apollo.queries.Spreadsheet.loading && $store.getters.isMoveDialogOpen"
    />
    <ExportFileDialog
      :dialogVisible="$store.getters.isExportFileDialogOpen"
      @handler="$store.dispatch('toggleExportFileDialog')"
      @export="exportHandler"
      class="no-print"
      :file="Spreadsheet"
      v-if="!this.$apollo.queries.Spreadsheet.loading && $store.getters.isExportFileDialogOpen"
    />
    <FilePermissionDialog
      :dialogVisible="$store.getters.isFilePermissionDialogOpen"
      @handler="$store.dispatch('toggleFilePermissionDialog')"
      class="no-print"
      :file="Spreadsheet"
      v-if="!this.$apollo.queries.Spreadsheet.loading && $store.getters.isFilePermissionDialogOpen"
    />
    <RemoveFileDialog
      :dialogVisible="$store.getters.isRemoveFileDialogOpen"
      @handler="$store.dispatch('toggleRemoveFileDialog')"
      class="no-print"
      :file="Spreadsheet"
      v-if="!this.$apollo.queries.Spreadsheet.loading && $store.getters.isRemoveFileDialogOpen"
    />
    <div class="editor balsa-container" style="margin-bottom:2%;position:relative;">
      <hot-table
        v-if="!this.$apollo.queries.Spreadsheet.loading"
        ref="hotRef"
        :data="Spreadsheet.content ? JSON.parse(Spreadsheet.content) : generateInitData()"
        :settings="spreadsheetData"
        :colHeaders="true"
        :search="true"
        :rowHeaders="true"
        :width="1000"
        :height="1000"
        :startRows="25"
        :startCols="25"
        :contextMenu="true"
        :columnSorting="true"
        :copyPaste="true"
        :collapsibleColumns="true"
        :dragToScroll="true"
        :filters="true"
        :headerTooltips="true"
        :afterChange="afterChange"
        :afterCreateRow="updateFile"
        :afterCreateCol="updateFile"
        :afterRemoveRow="updateFile"
        :afterRemoveCol="updateFile"

      >
      </hot-table>
    </div>
  </el-row>
</template>

<script>
  import Divider from './Divider.vue';

  import Icon from './Icon';
  import AddToFolderDialog from './Dialogs/AddToFolderDialog';
  import ExportFileDialog from './Dialogs/ExportFileDialog';
  import FilePermissionDialog from './Dialogs/FilePermissionDialog';
  import RemoveFileDialog from './Dialogs/RemoveFileDialog';
  import Avatar from './Avatar.vue';

  import 'handsontable/dist/handsontable.full.css';
  import {gql} from 'apollo-server-core';
  import TurnDown from 'turndown';
  import {MYPROFILE_QUERY} from '../queries';
  import {HotTable} from '@handsontable/vue';
  import Handsontable from 'handsontable';

  export default {
    name: 'Spreadsheet',
    components: {
      Avatar,
      Divider,
      AddToFolderDialog,
      ExportFileDialog,
      FilePermissionDialog,
      Icon,
      RemoveFileDialog,
      HotTable
    },
    data() {
      return {
        spreadsheetData: {
          // contextMenu: true,
          // search: true,
          // columnSorting: true,
          // copyPaste: true,
          collapsibleColumns: true,
          dragToScroll: true,
          filters: true,
          headerTooltips: {
            rows: true,
            columns: true,
            onlyTrimmed: false
          },
          // comments: true
        },
      };
    },

    apollo: {
      Spreadsheet: {
        query: gql`
        query Spreadsheet($id: Int!) {
          Spreadsheet(id: $id) {
            id
            name
            content
            isStarred
            hasWritePermission
            user {
              id
              firstName
              lastName
            }
            contributors {
              user {
                id
                firstName
                lastName
              }
            }
          }
        }
      `,
        variables() {
          return {
            id: parseInt(this.$route.params.id),
            log: true,
          };
        },
        // Error handling
        error(error) {
          console.error("We've got an error!", error.graphQLErrors[0].message);
        },
      },
      contributor: {
        query: gql`
        query contributor($inviteCode: String) {
          contributor(inviteCode: $inviteCode) {
            id
            permissionLevel
            email
            isAnon
            user {
              id
              email
            }
          }
        }
      `,
        skip() {
          return !this.$route.params.inviteCode;
        },
        variables() {
          return {
            inviteCode: this.$route.params.inviteCode,
          };
        },
        result({data}) {
          if (data.contributor.permissionLevel !== 'READ_WRITE') {
            this.editor.setOptions({
              editable: false,
            });
          }
        },
      },

      myProfile: {
        query: MYPROFILE_QUERY,
      },
    },
    methods: {
      afterChange(changes, source) {
        if ((changes && source !== 'loadData') || (!changes && source === 'loadData' && !this.Spreadsheet.content)) {
          this.updateFile()
        }
      },

      generateInitData() {
        return Handsontable.helper.createEmptySpreadsheetData(40, 25)
      },

      updateFile() {
        this.$apollo.mutate({
          mutation: gql`
                mutation updateFile($id: Int!, $content: String) {
                  updateFile(id: $id, content: $content) {
                    id
                    content
                  }
                }
              `,
          variables: {
            id: parseInt(this.$route.params.id),
            log: true,
            content: JSON.stringify(this.$refs.hotRef.hotInstance.getSourceData())
          },
          context: {
            debounceKey: '1',
          },
        });
      },

      saveContent(content, contentHtml, cursorPosition) {
        /* if (!has(content.content[0], 'content')) {
            this.editor.extensions.options.placeholder.emptyNodeText = this.randomPlaceHolder();
          }*/
        this.$store.dispatch('updateSavingState', true);
        this.updateFile({
          content: JSON.stringify(content),
          contentHtml: contentHtml,
          cursorPosition: cursorPosition,
        }).then(() => this.$store.dispatch('updateSavingState', false));
      },

      exportHandler(type) {
        if (type === 'pdf') {
          this.exportToPdf();
        } else if (type === 'docx') {
          this.exportToDoc();
        } else {
          this.exportToMD();
        }
      },
      exportToPdf() {
        window.print();
      },
      exportToDoc() {
        const header =
          "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
          "xmlns:w='urn:schemas-microsoft-com:office:word' " +
          "xmlns='http://www.w3.org/TR/REC-html40'>" +
          "<head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title></head><body>";
        const footer = '</body></html>';
        const sourceHTML = header + this.htmlData + footer;

        const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
        const fileDownload = document.createElement('a');
        document.body.appendChild(fileDownload);
        fileDownload.href = source;
        fileDownload.download = 'document.doc';
        fileDownload.click();
        document.body.removeChild(fileDownload);
      },
      exportToMD() {
        const turndownService = TurnDown();
        const markdown = turndownService.turndown(document.getElementsByClassName('ProseMirror')[0]);

        const source = 'data:text/markdown; charset=UTF-8,' + encodeURIComponent(markdown);
        const fileDownload = document.createElement('a');
        document.body.appendChild(fileDownload);
        fileDownload.href = source;
        fileDownload.download = 'document.md';
        fileDownload.click();
        document.body.removeChild(fileDownload);
      },
    },

  };
</script>
<style lang="scss">
  @import '../assets/sass/variables.scss';
  @import '~handsontable/dist/handsontable.full.css';

  .el-input--small input {
    font-size: 13px;
  }

  .editor__content table td,
  .editor__content table th {
    border: 2px solid #c8c8c8;
  }

  .comment-balsa {
    opacity: 1;
    transition: all 0.4s;
    position: absolute;
    width: 282px;
    right: -30%;
    background-color: white;
    padding: 16px;
    border-radius: 4px;
    box-shadow: rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
  }

  .closed {
    opacity: 0;
    right: -32%;
    transition: all 0.4s;
  }

  .comment-bg {
    background-color: #fffadc;
    font-size: inherit;
  }

  .comment-bg u {
    text-decoration: underline;
    text-decoration-color: #ffd20a;
  }

  .editor .comment-bg::after {
    position: absolute;
    right: -15px;
    content: url(../assets/images/icons/annotation.svg);
    height: 20px;
    width: 20px;
  }

  .menubar-positionFixed {
    position: fixed;
    transition: background 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, padding-top 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    padding-bottom 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    //box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
    border-bottom: 1px solid #efefef;
    padding-bottom: 5px;
    padding-top: 5px;
    background-color: #ffffff;
    z-index: 1;
    width: 100%;
    top: 60px;
  }

  .editor *.is-empty:nth-child(1)::before {
    padding-left: 3px;
  }

  .editor *.is-empty:nth-child(1)::before,
  .editor *.is-empty:nth-child(2)::before {
    content: attr(data-empty-text);
    float: left;
    color: #aaa;
    pointer-events: none;
    height: 0;
  }

  .editor__content {
    background: white;
    border-radius: 4px;
    padding: 0 80px;
    box-shadow: rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  }

  .ProseMirror {
    min-height: 125vh;
    padding-top: 75px;
    padding-bottom: 75px;
  }

  .trying {
    position: absolute;
    width: 50px;
    height: 50px;
    background-color: red;
  }

  .editor__content h1 {
    font-size: 31.3px;
    color: #1c4586;
  }

  .editor__content h2 {
    font-size: 25.1px;
    color: #1c4586;
  }

  .editor__content h3 {
    font-size: 21.95px;
    color: #1c4586;
  }

  .editor__content p {
    font-size: 17.24px;
    color: #293543;
    letter-spacing: -0.2px;
  }

  .ProseMirror > p {
    margin-top: 16px;
  }

  .menubar {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 10px 0;
  }

  ul[data-type='todo_list'] {
    padding-left: 0;
  }

  li[data-type='todo_item'] {
    display: flex;
    align-items: center;
    flex-direction: row;
  }

  .todo-checkbox {
    border: 1px solid #1c4586;
    height: 1.2em;
    width: 1.2em;
    box-sizing: border-box;
    margin-right: 20px;
    margin-top: 0;
    user-select: none;
    -webkit-user-select: none;
    cursor: pointer;
    border-radius: 0.2em;
    background-color: transparent;
    transition: 0.4s background;
  }

  .todo-content > p:last-of-type {
    font-weight: initial;
  }

  li[data-done='true'] > .todo-checkbox::after {
    content: '\e6da';
    color: white;
    top: 0px;
    left: 1.2px;
    font-weight: 600;
    font-size: 14px;
    position: relative;
  }

  .todo-content {
    flex: 1;

    > p:last-of-type {
      margin-bottom: 0;
    }

    > ul[data-type='todo_list'] {
      margin: 0.5rem 0;
    }
  }

  li[data-done='true'] {
    > .todo-content {
      > p {
        text-decoration: line-through;
      }
    }

    > .todo-checkbox {
      background-color: $color-black;
    }
  }

  li[data-done='false'] {
    text-decoration: none;
  }

  .balsa-editor-search {
    right: 0;
    position: fixed;
    top: 62px;
    background-color: white;
    padding-right: 12px;
    border-radius: 4px;
    z-index: 1;
    min-height: 48px;
    border: 1px solid #efefef;
    transition: all 0.2s;
  }

  .balsa-editor-search-close-icon {
    font-size: 16px;

    font-weight: 600;
    color: #5f6368;
  }

  .balsa-editor-search-close-icon:hover {
    color: #323333;
  }

  .hide-search {
    top: -10px;
  }

  .search {
    display: flex;
    flex-wrap: wrap;

    border-radius: 5px;

    input {
      border-radius: 4px;
      padding: 0.25rem;
      border: 1px solid #efefef;
      margin-right: 0.6rem;
      font: inherit;
      font-size: 0.8rem;
      width: 20%;
      flex: 1;
    }

    button {
      margin-right: 0.6rem;
    }
  }

  .find {
    background: rgba(255, 213, 0, 0.5);
    font-size: inherit;
  }

  .expanse-search {
    margin-right: 2px;
    width: 24px;
  }

  .expanse-search:hover {
    border-radius: 4px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    transition: all 0.2s;
  }

  .make-icon-down {
    transform: rotate(90deg);
  }

  .balsa-container {
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    max-width: 960px;
  }

  .mention {
    background: #d0e0e2;
    color: rgba($color-black, 0.6);
    font-size: 0.8rem;
    font-weight: bold;
    border-radius: 5px;
    padding: 0.2rem 0.5rem;
    white-space: nowrap;
  }

  .mention-suggestion {
    color: rgba($color-black, 0.6);
  }

  .suggestion-list {
    padding: 0.2rem;
    border: 2px solid rgba($color-black, 0.1);
    font-size: 0.8rem;
    font-weight: bold;

    &__no-results {
      padding: 0.2rem 0.5rem;
    }

    &__item {
      border-radius: 5px;
      padding: 0.2rem 0.5rem;
      margin-bottom: 0.2rem;
      cursor: pointer;

      &:last-child {
        margin-bottom: 0;
      }

      &.is-selected,
      &:hover {
        background-color: rgba($color-white, 0.2);
      }

      &.is-empty {
        opacity: 0.5;
      }
    }
  }

  .tippy-tooltip.dark-theme {
    background-color: $color-black;
    padding: 0;
    font-size: 1rem;
    text-align: inherit;
    color: $color-white;
    border-radius: 5px;

    .tippy-backdrop {
      display: none;
    }

    .tippy-roundarrow {
      fill: $color-black;
    }

    .tippy-popper[x-placement^='top'] & .tippy-arrow {
      border-top-color: $color-black;
    }

    .tippy-popper[x-placement^='bottom'] & .tippy-arrow {
      border-bottom-color: $color-black;
    }

    .tippy-popper[x-placement^='left'] & .tippy-arrow {
      border-left-color: $color-black;
    }

    .tippy-popper[x-placement^='right'] & .tippy-arrow {
      border-right-color: $color-black;
    }

    .iframe {
      &__embed {
        width: 100%;
        height: 15rem;
        border: 0;
      }

      &__input {
        display: block;
        width: 100%;
        font: inherit;
        border: 0;
        border-radius: 5px;
        background-color: rgba($color-black, 0.1);
        padding: 0.3rem 0.5rem;
      }
    }
  }

  pre {
    &::before {
      content: attr(data-language);
      text-transform: uppercase;
      display: block;
      text-align: right;
      font-weight: bold;
      font-size: 0.6rem;
    }

    code {
      .hljs-comment,
      .hljs-quote {
        color: #999999;
      }

      .hljs-variable,
      .hljs-template-variable,
      .hljs-attribute,
      .hljs-tag,
      .hljs-name,
      .hljs-regexp,
      .hljs-link,
      .hljs-name,
      .hljs-selector-id,
      .hljs-selector-class {
        color: #f2777a;
      }

      .hljs-number,
      .hljs-meta,
      .hljs-built_in,
      .hljs-builtin-name,
      .hljs-literal,
      .hljs-type,
      .hljs-params {
        color: #f99157;
      }

      .hljs-string,
      .hljs-symbol,
      .hljs-bullet {
        color: #99cc99;
      }

      .hljs-title,
      .hljs-section {
        color: #ffcc66;
      }

      .hljs-keyword,
      .hljs-selector-tag {
        color: #6699cc;
      }

      .hljs-emphasis {
        font-style: italic;
      }

      .hljs-strong {
        font-weight: 700;
      }
    }
  }

  .dark .menubar__button {
    color: rgb(172, 174, 175);
  }

  .dark .menubar__button.is-active {
    background-color: rgb(55, 61, 63);
  }

  .dark .menubar__button:hover {
    background-color: rgb(55, 61, 63);
  }

  .dark .balsa-editor-search {
    background-color: #373d3f;
    border: 1px solid #373d3f;
  }

  .dark .menubar-positionFixed {
    background-color: #303437;
    border-bottom: 1px solid #373d3f;
  }

  .dark .editor__content {
    background: #373d3f;
  }

  .dark .editor__content h1 {
    color: rgb(172, 174, 175);
  }

  .dark .editor__content table td,
  .editor__content table th {
    border: 2px solid rgb(172, 174, 175);
  }

  .dark .ctrl__f-search,
  .dark .ctrl__f-replace {
    background-color: rgba(33, 36, 38, 0.45);
    border: rgba(33, 36, 38, 0.45);
    font-weight: 600;
    opacity: 0.9;
    color: rgb(172, 174, 175);
  }

  .dark .ctrl__f-search::placeholder,
  .dark .ctrl__f-replace::placeholder {
    opacity: 0.9;
    color: rgb(172, 174, 175);
  }

  .editor__content a {
    color: #0a5394;
    cursor: pointer;
    text-decoration: underline;
  }

  p {
    line-height: 1.5;
  }

  li[data-done='true'] > .todo-checkbox {
    background-color: #1c4586;
  }

  li[data-type='todo_item'] {
    padding: 8px 0;
  }

  li[data-type='todo_item']:hover {
    background-color: #f5f5f5;
    border-radius: 4px;
    margin-left: -8px;
    padding-left: 8px;
  }

  .editor__content li > p {
    padding-left: 20px;
    font-weight: initial;
  }

  .el-icon-check:before {
    content: '';
  }

  .editor__content ul,
  .editor__content ol {
    color: #1c4586;
    font-size: 17.24px;
    font-weight: 600;
  }

  .editor__content blockquote {
    border-left: 3px solid #1c4586;
    padding: 10px;
    background-color: #e5e5e5;
  }
</style>

