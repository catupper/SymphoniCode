/**
 * codeGetter
 * THIS IS A SINGLETON
 */
export class CodeGetter {
  private static instance: CodeGetter;
  private static sourceCodeGetterOpaque: HTMLDivElement;
  /**
   * Constructor
   */
  constructor() {
    const sourceCodeGetterOpaque = document.createElement('div');
    sourceCodeGetterOpaque.setAttribute('id', 'source_code_getter_opaque');
    sourceCodeGetterOpaque.setAttribute('data-sourccCode', '');
    (document.body || document.head || document.documentElement).appendChild(
      sourceCodeGetterOpaque
    );
    const script = document.createElement('script');
    script.appendChild(
      document.createTextNode(
        `function update_sco () {
                var sco = document.getElementById('source_code_getter_opaque');
                sco.setAttribute('data-sourceCode', getSourceCode());
            }
            document.body.addEventListener('keydown', event => window.update_sco())
            `
      )
    );
    (document.body || document.head || document.documentElement).appendChild(
      script
    );
    CodeGetter.sourceCodeGetterOpaque = sourceCodeGetterOpaque;
  }

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
    return CodeGetter.sourceCodeGetterOpaque.dataset.sourcecode ?? '';
  }
}
