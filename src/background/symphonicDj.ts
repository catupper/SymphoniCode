import * as Tone from 'tone';

/**
 * SymphonicDj
 */
export class SymphonicDj {
  transitionCallback: (now: string) => string;
  samples: { [state: string]: () => void };
  currentState: string;

  /**
   * constructor
   * @param {[]} samples: samples
   * @param {function} transitionCallback: transitionCallback
   * @param {string} initialState: initialState
   */
  constructor(
    samples: { [state: string]: () => void },
    transitionCallback: (now: string) => string,
    initialState: string
  ) {
    this.samples = samples;
    this.transitionCallback = transitionCallback;
    this.currentState = initialState;
  }

  /**
   * start
   */
  start() {
    const self = this;
    Tone.Transport.scheduleRepeat(() => {
      self.samples[self.currentState]();
    }, '4m');
    Tone.Transport.scheduleRepeat(
      () => {
        self.currentState = self.transitionCallback(self.currentState);
      },
      '4m',
      '2m'
    );
    Tone.Transport.start();
  }
}
