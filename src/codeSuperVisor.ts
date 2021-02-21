import { CodeGetter } from './getSourceCode';

export type States = { [key: string]: any };
export type CallBackFunction = (
  oldCode: string,
  newCode: string,
  states: States
) => void;

/**
 * codeSupervisor
 */
export class CodeSupervisor {
  code: string;
  states: States;
  callbackFuncs: CallBackFunction[];
  codeGetter: CodeGetter;
  /**
   * Constructor
   */
  constructor() {
    this.code = '';
    this.states = {};
    this.callbackFuncs = [];
    this.codeGetter = CodeGetter.getInstance();
  }

  /**
   * update states by calling callback funcs.
   * @param {string} sourceCode: latest sourcecode
   */
  update(sourceCode: string) {
    console.log(sourceCode);
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
    document.body.addEventListener('keydown', (event) => {
      self.update(self.codeGetter.getSourceCode());
    });
  }
}
