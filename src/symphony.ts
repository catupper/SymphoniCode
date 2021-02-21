import { CodeSupervisor, States } from './codeSuperVisor';

const codeSupervisor = new CodeSupervisor();

const checkCodeLength = function (
  oldCode: String,
  newCode: String,
  states: States
) {
  const newLength = newCode.length;
  const oldLength = states['length'];
  const lastStroke = states['strokes'];
  states['strokes'] += Math.abs(newLength - oldLength);
  states['length'] = newLength;
  if (Math.floor(states['strokes'] / 5) - Math.floor(lastStroke / 5)) {
    chrome.runtime.sendMessage({ length: length }, () => {});
  }
};

const initCodeLength = function (states: States) {
  states['length'] = 0;
  states['strokes'] = 0;
};

codeSupervisor.addCallbackFunc(checkCodeLength, initCodeLength);

codeSupervisor.run();
