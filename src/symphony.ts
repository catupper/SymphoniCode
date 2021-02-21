type States = { [key: string]: any };
type CallBackFunction = (
  oldCode: string,
  newCode: string,
  states: States
) => void;

/**
 * codeSupervisor
 */
class CodeSupervisor {
  code: string;
  states: States;
  callbackFuncs: CallBackFunction[];

  /**
   * Constructor
   */
  constructor() {
    this.code = '';
    this.states = {};
    this.callbackFuncs = [];
  }

  /**
   * update states by calling callback funcs.
   * @param {string} sourceCode: latest sourcecode
   */
  update(sourceCode: string) {
    for (const f of this.callbackFuncs) {
      f(this.code, sourceCode, this.states);
    }
    this.code = sourceCode;
  }

  /**
   * Add callbakc functions.
   * @param {CallBackFunction} f callback function
   * @param {Function} initialization initialization function
   */
  addCallbackFunc(
    f: CallBackFunction,
    initialization: (states: States) => void
  ) {
    if (initialization !== undefined) initialization(this.states);
    this.callbackFuncs.push(f);
  }

  /**
   * Run
   */
  run() {
    const self = this;
    setInterval(function () {
      self.update(
        document.getElementById('source_code_phantom')?.dataset.sourcecode || ''
      );
    }, 1000);
  }
}

const codeSupervisor = new CodeSupervisor();
codeSupervisor.addCallbackFunc(
  function (oldCode: String, newCode: String, states: States) {
    const newLength = newCode.length;
    const oldLength = states['length'];
    const lastStroke = states['strokes'];
    states['strokes'] += Math.abs(newLength - oldLength);
    states['length'] = newLength;
    if (Math.floor(states['strokes'] / 5) - Math.floor(lastStroke / 5)) {
      console.log('Length: ' + newLength + '\nStrokes: ' + states['strokes']);
    }
  },
  function (states: States) {
    states['length'] = 0;
    states['strokes'] = 0;
  }
);

// codeSupervisor.run();

const getCode = () => {
  const lines = document.getElementsByClassName('CodeMirror-line');
  const n = lines.length;

  const code = new Array(n)
    .fill('')
    .map((_, i) => lines[i].textContent ?? '')
    .join('\n');

  return code;
};

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  switch (req.type) {
    case 'sourceCode':
      sendResponse(
        [
          ...document
            .getElementsByClassName('btn-toggle-editor')[0]
            .classList.values(),
        ].includes('active')
          ? (document.getElementsByClassName('plain-textarea')[0] as
              | HTMLTextAreaElement
              | undefined)?.value ?? ''
          : getCode()
      );
      break;

    default:
      sendResponse(null);
  }
});
