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
        handsomedata: {
          default: [
            ['', 'Tesla', 'Volvo', 'Toyota', 'Ford'],
            ['2019', 10, 11, 12, 13],
            ['2020', 20, 11, 14, 13],
            ['2021', 30, 15, 18, 13],
          ],
        },
      },

      toDOM: node => {
        return [
          'div',
          {
            class: 'handsome-table',
            handsomeguid: node.attrs.guid,
            handsomedata: JSON.stringify(node.attrs.handsomedata),
          },
        ];
      },

      parseDOM: [
        {
          tag: 'div[handsomeguid]',
          getAttrs: dom => ({
            guid: dom.getAttribute('guid'),
            handsomedata: dom.getAttribute('handsomedata'),
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
          dispatch(transaction);
        };
      },
    };
  }

  get plugins() {
    return [HandsonTablePlugin({})];
  }
}
