import { ReplaceStep } from 'prosemirror-transform';

export class HandsonTableState {
  constructor(options) {
    this.active = false;
    this._id = null;
    this.options = options;
  }

  init() {
    return {
      active: this.active,
      _id: this._id,
    };
  }

  apply(transaction, value, oldState, newState) {
    const recursiveSearch = node => {
      if (node.childCount) {
        node.content.forEach(recursiveSearch);
        // recursiveSearch(node);
      }
      if (node.attrs.guid && node.attrs.handsomedata) {
        newState.guid = node.attrs.guid;
        newState.handsonSettings = {
          data: node.attrs.handsomedata,
          rowHeaders: true,
          colHeaders: true,
          afterChange: changes => {
            if (changes) {
              changes.forEach(([row, prop, oldValue, newValue]) => {
                newState.handsonSettings.data[row][prop] = newValue;
              });
            }
          },
          afterSetDataAtCell: (changes, source) => {
            if (changes) {
              changes.forEach(([row, prop, oldValue, newValue]) => {
                newState.handsonSettings.data[row][prop] = newValue;
              });
            }
          },
        };
      }
    };

    for (const step of transaction.steps) {
      if (step instanceof ReplaceStep) {
        // add with button
        step.slice.content.forEach(recursiveSearch);
      }
    }
    /*

     */
    return newState;
  }
}
