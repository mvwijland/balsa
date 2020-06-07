import { Plugin, PluginKey } from 'prosemirror-state';
import { Extension } from 'tiptap';
import { Decoration, DecorationSet } from 'prosemirror-view';
const TOTAL_COLOR_COUNT = 6;
const colorClasses = Array.from({ length: TOTAL_COLOR_COUNT }, (x, i) => `remoteUserCursor${i}`);

const getRandomColorClass = () => {
  return colorClasses[Math.floor(Math.random() * colorClasses.length)];
};

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
            let cursors = {};
            return {
              cursors,
              userId: _this.options.userId,
            };
          },

          apply(tr, prev) {
            const { selection } = tr;
            const next = { ...prev };
            next.cursors[next.userId] = {};
            next.cursors[next.userId].position = selection.from > selection.to ? selection.from : selection.to;
            if (!next.cursors[next.userId].colorClass) {
              next.cursors[next.userId].colorClass = getRandomColorClass();
            }
            _this.options.updateCursor(next.cursors[next.userId].position, next.cursors[next.userId].colorClass);
            return next;
          },
        },

        props: {
          decorations(editorState) {
            const decos = [];
            for (const [user, data] of Object.entries(_this.options.cursors)) {
              const position = data.position;
              const userName = data.name;
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
    cursorUpdated: () => {},
    updateCursor: position => {},
    userId: null,
    cursors: {},
  },
) {
  return new MultiCursorExtension(options);
}
