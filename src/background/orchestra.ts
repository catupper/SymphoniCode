import * as Tone from 'tone';
import { SymphonicDj } from './symphonicDj';

Tone.Transport.bpm.value = 120;
const synth = new Tone.Synth().toDestination();

const samples: { [state: string]: () => void } = {
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
let codeLength: number = 0;

/**
 * noteUpDown
 * codeLentghが偶数なら音を上げて，奇数なら音を下げる
 * @param {string} now: curent state
 * @return {string}: next state
 */
function noteUpDown(now: string) {
  if (codeLength % 2 == 0) {
    return '' + ((parseInt(now) + 1) % sampleLength);
  } else {
    return '' + ((parseInt(now) + sampleLength - 1) % sampleLength);
  }
}

const symphonicDj = new SymphonicDj(samples, noteUpDown, '3');

let started: boolean = false;

chrome.runtime.onMessage.addListener(function (request, sender, sendResonse) {
  if (!started) {
    symphonicDj.start();
    started = true;
  }
  codeLength = request['length'];
});
