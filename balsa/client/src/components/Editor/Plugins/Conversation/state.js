import { getClickMark, getCommentStep } from './utils';
import { AddMarkStep, RemoveMarkStep } from 'prosemirror-transform';

export class ConversationState {
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
    const step = getCommentStep(transaction);
    if (step) {
      // a new conversation is added  or an existing one is removed
      const addMark = step instanceof AddMarkStep;
      const removeMark = step instanceof RemoveMarkStep;
      const mark = step.mark;

      if (addMark) {
        newState.active = true;
        newState.selectedConversationId = mark.attrs.guid;
      } else if (removeMark) {
        newState.active = false;
        newState.selectedConversationId = null;
      }
    } else {
      const mark = getClickMark(transaction);

      if (mark) {
        if (oldState.selectedConversationId) {
          if (oldState.selectedConversationId !== mark.attrs.guid) {
            newState.selectedConversationId = mark.attrs.guid;
            newState.active = true;
          } else {
            newState.selectedConversationId = null;
            newState.active = false;
          }
        } else {
          newState.active = true;
          newState.selectedConversationId = mark.attrs.guid;
        }
      } else {
        if (transaction.meta.focused === false && oldState.active === true) {
          newState.active = true;
          newState.selectedConversationId = oldState.selectedConversationId;
        }
      }
    }

    return newState;
  }
}
