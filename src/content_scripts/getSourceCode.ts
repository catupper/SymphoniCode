/**
 * getSourceCode
 * @return {string} sourceCode
 */
export const getSourceCode = (): string => {
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
};
