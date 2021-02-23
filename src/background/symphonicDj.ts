import * as Tone from 'tone';

/**
 * SymphonicDj
 */
export class SymphonicDj<DjState extends string> {
  transitionCallback: (now: DjState) => DjState;
  samples: Record<DjState, () => void>;
  currentState: DjState;
  started: boolean;
  /**
   * constructor
   * @param {{DjState: function}} samples: 状態(string)を開始するときに実行する関数
   * @param {function} transitionCallback: 今の状態を引数として次の状態を返してくれる関数
   * @param {string} initialState: 最初の状態
   */
  constructor(
    samples: Record<DjState, () => void>,
    transitionCallback: (now: DjState) => DjState,
    initialState: DjState
  ) {
    this.samples = samples;
    this.transitionCallback = transitionCallback;
    this.currentState = initialState;
    this.started = false;
  }

  /**
   * start
   */
  start() {
    if (this.started) return;
    this.started = true;
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
