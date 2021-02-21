/**
 * codeGetter
 * THIS IS A SINGLETON
 */
export class CodeGetter {
  private static instance: CodeGetter;

  /**
   * getInstance
   * @return {CodeGetter} The unique CodeGetter instance
   */
  static getInstance() {
    if (!CodeGetter.instance) {
      CodeGetter.instance = new CodeGetter();
    }
    return CodeGetter.instance;
  }

  /**
   * getSourceCode
   * @return {string} sourceCode
   */
  getSourceCode() {
    const isPlain = [
      ...document
        .getElementsByClassName('btn-toggle-editor')[0]
        .classList.values(),
    ].includes('active');

    if (isPlain) {
      return (
        (document.getElementsByClassName('plain-textarea')[0] as
          | HTMLTextAreaElement
          | undefined)?.value ?? ''
      );
    }

    const lines = document.getElementsByClassName('CodeMirror-line');
    const n = lines.length;

    const code = new Array(n)
      .fill('')
      .map((_, i) => lines[i].textContent ?? '')
      .join('\n');

    return code;
  }
}
