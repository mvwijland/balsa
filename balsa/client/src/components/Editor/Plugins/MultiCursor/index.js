import { Plugin, PluginKey } from 'prosemirror-state';
import { Extension } from 'tiptap';
import { Decoration, DecorationSet } from 'prosemirror-view';

class MultiCursorExtension extends Extension {
  constructor(options) {
    super();
    this.options = {
      ...this.defaultOptions,
      ...options,
    };
  }

  get name() {
    return 'multicursor';
  }

  get plugins() {
    const _this = this;
    const key = new PluginKey('multicursor');
    return [
      new Plugin({
        key,
        name: 'multicursor',
        view() {
          return {
            update: (view, lastState) => {
              const root = document.getElementById('cursorNameBar');
              for (const elem of document.getElementsByClassName('remoteUserCursor')) {
                elem.onmouseover = function() {
                  const { top, left } = elem.getBoundingClientRect();
                  root.innerText = elem.getAttribute('data-user-name');
                  root.style.top = `${top - 110}px`;
                  root.style.left = `${left}px`;
                  root.style.display = 'block';
                };
                elem.onmouseleave = function() {
                  root.style.display = 'none';
                };
              }
            },
          };
        },

        state: {
          init() {
            let cursors = _this.options.cursors;
            return {
              cursors,
              userName: _this.options.userName,
              userId: _this.options.userId,
            };
          },

          apply(tr, prev) {
            const { selection, steps } = tr;
            const next = { ...prev };
            const position = selection.from > selection.to ? selection.from : selection.to;
            const userName = _this.options.userName;

            // set others
            for (const [user, data] of Object.entries(_this.options.getCursors())) {
              if (user !== _this.options.userId) {
                next.cursors[user] = data;
              }
            }

            // set myself
            next.cursors[next.userId] = {
              position,
              userName,
            };
            _this.options.updateCursor(next.cursors[next.userId].position);
            return next;
          },
        },

        props: {
          decorations(editorState) {
            const pluginState = key.getState(editorState);
            const decos = [];
            for (const [user, data] of Object.entries(pluginState.cursors)) {
              const position = data.position;
              const userName = data.userName;
              if (user != _this.options.userId) {
                decos.push(
                  Decoration.inline(
                    position - 1,
                    position,
                    {
                      nodeName: 'span',
                      class: 'remoteUserCursor',

                      style: 'font-size: inherit;',
                      'data-user-name': userName,
                    },
                    { inclusiveStart: false, inclusiveEnd: false },
                  ),
                );
              }
            }
            return DecorationSet.create(editorState.doc, decos);
          },
        },
      }),
    ];
  }
}

export default function(
  options = {
    updateCursor: position => {},
    userId: null,
    userName: null,
    cursors: {},
    getCursors: () => {},
  },
) {
  return new MultiCursorExtension(options);
}
