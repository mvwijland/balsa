import { Plugin, PluginKey } from 'prosemirror-state';
import { HandsonTableState } from './state';
import Handsontable from "handsontable";

class HandsonTablePlugin {
  constructor({ editorView, options, key }) {
    this.options = options;
    this.editorView = editorView;
    this.key = key;
  }

  update(view, lastState) {
    const prev = this.key.getState(lastState);
    const next = this.key.getState(view.state);
    const container = document.querySelector(`div[handsomeguid="${next.guid}"]`);
    if (container) {
      const data = [
        ['', 'Tesla', 'Volvo', 'Toyota', 'Ford'],
        ['2019', 10, 11, 12, 13],
        ['2020', 20, 11, 14, 13],
        ['2021', 30, 15, 12, 13],
      ];

      const hot = new Handsontable(container, {
        data: data,
        rowHeaders: true,
        colHeaders: true,
      });
    }
  }

  hide(event) {}

  destroy() {}
}

export default function(options) {
  return new Plugin({
    key: new PluginKey('handsonTable'),
    view(editorView) {
      return new HandsonTablePlugin({ editorView, options, key: this.key });
    },
    state: new HandsonTableState({ options: options }),
  });
}
