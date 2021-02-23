import { CodeSupervisor, States } from './codeSuperVisor';

const codeSupervisor = new CodeSupervisor();

const checkCodeLength = function (
  oldCode: String,
  newCode: String,
  states: States
) {
  const newLength = newCode.length;
  const oldLength = states['length'];
  states['strokes'] += Math.abs(newLength - oldLength);
  states['length'] = newLength;
  chrome.runtime.sendMessage({ length: length }, () => {});
};

const initCodeLength = function (states: States) {
  states['length'] = 0;
  states['strokes'] = 0;
};

codeSupervisor.addCallbackFunc(checkCodeLength, initCodeLength);

codeSupervisor.run();
