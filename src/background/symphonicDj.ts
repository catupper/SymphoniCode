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
   * @param {{string: function}} samples: 状態(string)を開始するときに実行する関数
   * @param {function} transitionCallback: 今の状態を引数として次の状態を返してくれる関数
   * @param {string} initialState: 最初の状態
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
    // 4小節(4measures)ごとに一回 状態self.currentState に対応する関数を実行
    Tone.Transport.scheduleRepeat(() => {
      self.samples[self.currentState]();
    }, '4m');

    // 2小節目から開始して4小節ごとに一回 状態self.currentStateを次の状態にアップデート
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
