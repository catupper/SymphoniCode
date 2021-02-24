import * as Tone from 'tone';

export type DjState<DjStateLabel extends string> = {
  defaultNextState: DjStateLabel;
  initializer: () => void;
};

export type DjStateSet<DjStateLabel extends string> = Record<
  DjStateLabel,
  DjState<DjStateLabel>
>;

/**
 * SymphonicDj
 */
export class SymphonicDj<DjStateLabel extends string> {
  transitionCallback: (now: DjStateLabel) => Promise<DjStateLabel>;
  states: DjStateSet<DjStateLabel>;
  currentState: DjStateLabel;
  started: boolean;
  /**
   * constructor
   * @param {{DjState: function}} states: 状態(string)を開始するときに実行する関数
   * @param {function} transitionCallback: 今の状態を引数として次の状態を返してくれる関数
   * @param {string} initialState: 最初の状態
   */
  constructor(
    states: DjStateSet<DjStateLabel>,
    transitionCallback: (now: DjStateLabel) => Promise<DjStateLabel>,
    initialState: DjStateLabel
  ) {
    this.states = states;
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
    Tone.Transport.scheduleRepeat(
      () => {
        self.states[self.currentState].initializer();
      },
      '4m',
      Tone.Transport.nextSubdivision('4m')
    );

    // 2小節目から開始して4小節ごとに一回 状態self.currentStateを次の状態にアップデート
    Tone.Transport.scheduleRepeat(
      (time) => {
        console.log(self.currentState);
        Promise.race([
          new Promise((resolve, reject) => {
            resolve(self.transitionCallback(self.currentState));
          }),
          new Promise((resolve, reject) => {
            setTimeout(
              resolve,
              Tone.Time('2m').toSeconds() * 1000 - 100,
              self.states[self.currentState].defaultNextState
            );
          }),
        ]).then((val) => {
          console.log(['winner', val]);
          self.currentState = val as DjStateLabel;
        });
      },
      '4m',
      Tone.Transport.nextSubdivision('4m') + Tone.Time('2m').toSeconds()
    );
    if (Tone.Transport.state != 'started') Tone.Transport.start();
  }
}
