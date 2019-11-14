import { Node } from 'tiptap';
import { toggleBlockType } from 'tiptap-commands';
import HandsonTablePlugin from '../Plugins/HandsonTable/index';
import uuidv4 from 'uuid/v4';

export default class HandsonTable extends Node {
  get name() {
    return 'handsontable';
  }

  get schema() {
    return {
      inline: true,
      group: 'inline',
      attrs: {
        guid: {
          default: '',
        },
      },

      toDOM: node => {
        return ['div', { class: 'handsome-table', handsomeguid: node.attrs.guid }];
      },

      parseDOM: [
        {
          tag: 'div[handsomeguid]',
          getAttrs: dom => ({
            guid: dom.getAttribute('guid'),
          }),
        },
      ],
    };
  }

  commands({ type }) {
    return {
      createHandsonTable: () => {
        return (state, dispatch) => {
          const guid = uuidv4();
          const { selection } = state;
          const position = selection.$cursor ? selection.$cursor.pos : selection.$to.pos;
          const node = type.create({ guid });
          const transaction = state.tr.insert(position, node);
          // console.log('TRANSaction', node);
          dispatch(transaction);
        };
      },
    };
  }

  get plugins() {
    return [HandsonTablePlugin({})];
  }
}
