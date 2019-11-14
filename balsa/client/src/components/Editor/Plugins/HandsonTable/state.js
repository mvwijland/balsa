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
    for (const step of transaction.steps) {
      if (step instanceof ReplaceStep) {
        const guid = step.slice.content.content[0].attrs.guid;
        if (guid) {
          newState.guid = guid;
        }
      }
    }
    /*

     */
    return newState;
  }
}
