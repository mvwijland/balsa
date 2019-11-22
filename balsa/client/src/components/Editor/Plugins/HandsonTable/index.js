import { Plugin, PluginKey } from 'prosemirror-state';
import { HandsonTableState } from './state';
import Handsontable from 'handsontable';

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
      const hot = new Handsontable(container, {
        ...next.handsonSettings,
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
