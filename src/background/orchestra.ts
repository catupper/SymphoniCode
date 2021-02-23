import * as Tone from 'tone';
import { DjStateSet, SymphonicDj } from './symphonicDj';

Tone.Transport.bpm.value = 120;
const synth = new Tone.Synth().toDestination();

type DjStateLabel = '0' | '1' | '2' | '3' | '4' | '5' | '6';

const states: DjStateSet<DjStateLabel> = {
  '0': {
    defaultNextState: '0',
    initializer: () => {
      synth.triggerAttackRelease('D3', '4m');
    },
  },
  '1': {
    defaultNextState: '1',
    initializer: () => {
      synth.triggerAttackRelease('F3', '4m');
    },
  },
  '2': {
    defaultNextState: '2',
    initializer: () => {
      synth.triggerAttackRelease('A3', '4m');
    },
  },
  '3': {
    defaultNextState: '3',
    initializer: () => {
      synth.triggerAttackRelease('C4', '4m');
    },
  },
  '4': {
    defaultNextState: '4',
    initializer: () => {
      synth.triggerAttackRelease('E4', '4m');
    },
  },
  '5': {
    defaultNextState: '5',
    initializer: () => {
      synth.triggerAttackRelease('G4', '4m');
    },
  },
  '6': {
    defaultNextState: '6',
    initializer: () => {
      synth.triggerAttackRelease('B4', '4m');
    },
  },
};

/**
 * CodeStateManager
 */
class CodeStateManager<DjState extends string> {
  codeLength: number;
  symphonicDj: SymphonicDj<DjState>;
  /**
   * constructor
   * @param {SymphonicDj} symphonicDj: DJを注入．
   */
  constructor(symphonicDj: SymphonicDj<DjState>) {
    this.symphonicDj = symphonicDj;
    this.codeLength = 0;
    const self = this;
    chrome.runtime.onMessage.addListener(function (
      request,
      sender,
      sendResonse
    ) {
      if (!self.symphonicDj.started) {
        self.symphonicDj.start();
      }
      self.codeLength = request['length'];
    });
  }

  /**
   * noteUpDown
   * codeLentghが偶数なら音を上げて，奇数なら音を下げる
   * @param {DjState} now: curent state
   * @return {DjState}: next state
   */
  noteUpDown(now: DjState) {
    const stateLength = Object.keys(this.symphonicDj.states).length;
    if (this.codeLength % 2 == 0) {
      return ('' + ((parseInt(now) + 1) % stateLength)) as DjState;
    } else {
      return ('' +
        ((parseInt(now) + stateLength - 1) % stateLength)) as DjState;
    }
  }
}

const symphonicDj: SymphonicDj<DjStateLabel> = new SymphonicDj(
  states,
  (now: DjStateLabel) => codeStateManager.noteUpDown(now),
  '3'
);

const codeStateManager = new CodeStateManager(symphonicDj);
