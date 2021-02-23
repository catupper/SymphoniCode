import * as Tone from 'tone';
import { SymphonicDj } from './symphonicDj';

Tone.Transport.bpm.value = 120;
const synth = new Tone.Synth().toDestination();

type DjState = '0' | '1' | '2' | '3' | '4' | '5' | '6';

const samples: Record<DjState, () => void> = {
  '0': () => {
    synth.triggerAttackRelease('D3', '4m');
  },
  '1': () => {
    synth.triggerAttackRelease('F3', '4m');
  },
  '2': () => {
    synth.triggerAttackRelease('A3', '4m');
  },
  '3': () => {
    synth.triggerAttackRelease('C4', '4m');
  },
  '4': () => {
    synth.triggerAttackRelease('E4', '4m');
  },
  '5': () => {
    synth.triggerAttackRelease('G4', '4m');
  },
  '6': () => {
    synth.triggerAttackRelease('B4', '4m');
  },
};
const sampleLength = Object.keys(samples).length;

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
    if (this.codeLength % 2 == 0) {
      return ('' + ((parseInt(now) + 1) % sampleLength)) as DjState;
    } else {
      return ('' +
        ((parseInt(now) + sampleLength - 1) % sampleLength)) as DjState;
    }
  }
}

const symphonicDj: SymphonicDj<DjState> = new SymphonicDj(
  samples,
  (now: DjState) => codeStateManager.noteUpDown(now),
  '3'
);

const codeStateManager = new CodeStateManager(symphonicDj);
