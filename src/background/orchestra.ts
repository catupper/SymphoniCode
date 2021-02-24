import * as Tone from 'tone';
import { DjStateSet, SymphonicDj } from './symphonicDj';

Tone.Transport.bpm.value = 120;
const synth = new Tone.Synth().toDestination();

type DjStateLabel = '0' | '1' | '2' | '3' | '4' | '5' | '6' | 'd';

const states: DjStateSet<DjStateLabel> = {
  '0': {
    defaultNextState: 'd',
    initializer: () => {
      synth.triggerAttackRelease('D3', '4m');
    },
  },
  '1': {
    defaultNextState: 'd',
    initializer: () => {
      synth.triggerAttackRelease('F3', '4m');
    },
  },
  '2': {
    defaultNextState: 'd',
    initializer: () => {
      synth.triggerAttackRelease('A3', '4m');
    },
  },
  '3': {
    defaultNextState: 'd',
    initializer: () => {
      synth.triggerAttackRelease('C4', '4m');
    },
  },
  '4': {
    defaultNextState: 'd',
    initializer: () => {
      synth.triggerAttackRelease('E4', '4m');
    },
  },
  '5': {
    defaultNextState: 'd',
    initializer: () => {
      synth.triggerAttackRelease('G4', '4m');
    },
  },
  '6': {
    defaultNextState: 'd',
    initializer: async () => {
      synth.triggerAttackRelease('B4', '4m');
    },
  },
  d: {
    defaultNextState: '3',
    initializer: () => {
      synth.triggerAttackRelease('C#4', '4m');
    },
  },
};

/**
 * CodeStateManager
 */
class CodeStateManager<DjStateLabel extends string> {
  codeLength: number;
  symphonicDj: SymphonicDj<DjStateLabel>;
  /**
   * constructor
   * @param {SymphonicDj} symphonicDj: Djを注入．
   */
  constructor(symphonicDj: SymphonicDj<DjStateLabel>) {
    this.symphonicDj = symphonicDj;
    this.codeLength = 0;
    const self = this;
    chrome.runtime.onMessage.addListener(function (
      request,
      sender,
      sendResonse
    ) {
      self.symphonicDj.start();
      self.codeLength = request['length'];
    });
  }

  /**
   * noteUpDown
   * codeLentghが偶数なら音を上げて，奇数なら音を下げる
   * @param {DjStateLabel} now: curent state
   * @return {DjStateLabel}: next state
   */
  async noteUpDown(now: DjStateLabel) {
    const stateLength = 7;
    if (now == 'd') {
      return '3';
    } else {
      if (now == '5') {
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
      if (this.codeLength % 2 == 0) {
        return ('' + ((parseInt(now) + 1) % stateLength)) as DjStateLabel;
      } else {
        return ('' +
          ((parseInt(now) + stateLength - 1) % stateLength)) as DjStateLabel;
      }
    }
  }
}

const symphonicDj: SymphonicDj<DjStateLabel> = new SymphonicDj(
  states,
  (now: DjStateLabel) => codeStateManager.noteUpDown(now),
  '3'
);

const codeStateManager = new CodeStateManager(symphonicDj);
