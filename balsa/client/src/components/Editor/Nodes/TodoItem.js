import { Node } from 'tiptap';
import { sinkListItem, splitToDefaultListItem, liftListItem } from 'tiptap-commands';

export default class TodoItem extends Node {
  get name() {
    return 'todo_item';
  }

  get defaultOptions() {
    return {
      nested: false,
    };
  }

  get view() {
    return {
      props: ['node', 'updateAttrs', 'view'],
      data() {
        return {
          infoText: `Type your action, use '@' to assign to someone.`,
        };
      },
      methods: {
        onChange() {
          this.updateAttrs({
            done: !this.node.attrs.done,
          });
        },
      },
      template: `
        <li :data-type="node.type.name" :data-done="node.attrs.done.toString()" data-drag-handle >
          <span class="todo-checkbox el-icon-check" contenteditable="false" @click="onChange"></span>         
          <div v-if="node.textContent"   class="todo-content" ref="content" :contenteditable="view.editable.toString()"></div>
          <div  v-else class="todo-content is-empty" :data-empty-text="infoText" ref="content" :contenteditable="view.editable.toString()" style='font-weight:initial;'></div>
        </li>
      `,
    };
  }

  get schema() {
    return {
      attrs: {
        done: {
          default: false,
        },
      },
      draggable: true,
      content: this.options.nested ? '(paragraph|todo_list)+' : 'paragraph+',
      toDOM: node => {
        const { done } = node.attrs;

        return [
          'li',
          {
            'data-type': this.name,
            'data-done': done.toString(),
          },
          ['span', { class: 'todo-checkbox', contenteditable: 'false' }],
          ['div', { class: 'todo-content' }, 0],
        ];
      },
      parseDOM: [
        {
          priority: 51,
          tag: `[data-type="${this.name}"]`,
          getAttrs: dom => ({
            done: dom.getAttribute('data-done') === 'true',
          }),
        },
      ],
    };
  }

  keys({ type }) {
    return {
      Enter: splitToDefaultListItem(type),
      Tab: this.options.nested ? sinkListItem(type) : () => {},
      'Shift-Tab': liftListItem(type),
    };
  }
}
