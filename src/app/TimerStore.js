// Import the observable, computed, and action methods from mobx
import {observable, computed, action} from 'mobx';
// Import uuid, so that we can give each lap entry it's own unique identifier.
import {v4} from 'node-uuid';
// Import the moment library, which is for parsing and manipulating dates.
import moment from 'moment';
import format from 'format-number-with-string';


/*
  Now, we are creating and exporting our Timer class. This is where our data is actually being generated.

  When we see or use import or require in Node, we are actually accessing a *module*. Modules help
  us encapsulate the methods for easier use in other files.
*/
export class Timer {
  /* We are marking milliseconds and savedMilliseconds as something that will change in state. */
  @observable milliseconds;
  @observable savedMilliseconds;

  /*
    We want to define some default values. With a timer, we want to start at 0.
    We also generate a unique identifier (UUID = Universally Unique Identifier)
   */
  constructor(initialMilliseconds = 0) {
    this.milliseconds = initialMilliseconds;
    this.savedMilliseconds = 0;
    this.id = v4();
  }

  /*
    Here, we define our first action, where we can update the savedMilliseconds, to match the current.
    This will also return our main timer to 0.

    Note: In strict mode, which we are in, you can only change an observable using an action. These are
    where our data *changes*
  */
  @action saveTime() {
    this.savedMilliseconds += this.milliseconds;
    this.milliseconds = 0;
  }

  /*
    Our reset() action will simply return both the milliseconds and the savedMilliseconds to 0.
  */
  @action reset() {
    this.milliseconds = this.savedMilliseconds = 0;
  }

  @computed get totalMilliSeconds() {
    return this.milliseconds + this.savedMilliseconds;
  }

  @computed get display() {
    const tenMilliSeconds = parseInt(this.totalMilliSeconds / 10, 10);

    const seconds = parseInt(tenMilliSeconds / 100, 10);
    const minutes = parseInt(seconds / 60, 10);

    return `${minutes} : ${format(seconds % 60, '00')} :  ${format(tenMilliSeconds % 100, '00')}`;
  }
}

/*
  Now, the TimerStore class is defined.
*/
export class TimerStore {
  /*
    We want:
     a boolean for whether or not the timer is running,
     an instance of our Timer that we created above
     a value representing when the timer began.
     an array of all laps that have been entered.
  */
  @observable isRunning;
  @observable timer;
  @observable startTime;
  @observable laps;

  /*
    Our constructor allows us to define our initial values for these observables.
  */
  constructor() {
    this.isRunning = false;
    this.timer = new Timer();
    this.laps = [];
  }

  /*
    Computed values rely on the data in state. They are DERIVED from observables, and
    allow us to get a value from the observable state.
    If we get the mainDisplay, we are retrieving an observable from the timer.
  */
  @computed get mainDisplay() {
    return this.timer.display;
  }

  /*
    Here, we return a boolean value, representing whether or not our timer is running.
  */
  @computed get hasStarted() {
    return this.timer.totalMilliSeconds !== 0;
  }

  /*
    Here, we update our Timer.milliseconds using the difference between now and the startTime
  */
  @action measure() {
    if (!this.isRunning) return;

    this.timer.milliseconds = moment().diff(this.startTime);

    // This will be measured after 10 milliseconds have passed.
    setTimeout(() => this.measure(), 10);
  }

  @action startTimer() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.startTime = moment();
    this.measure();
  }

  @computed get length() {
    return this.laps.length;
  }

  @computed get lapTime() {
    return this.laps.map((el) => el.totalMilliSeconds)
      .reduce((x, y) => x + y, 0);
  }

  @action lapTimer() {
    this.laps.push(new Timer(this.timer.totalMilliSeconds - this.lapTime));
  }

  @computed get lapData() {
    const data = [];
    for (let i = 0; i < this.laps.length; i++) {
      data.push({
        lap: this.laps[i],
        text: `Lap ${i + 1}`,
      });
    }
    return data.reverse();
  }

  @action stopTimer() {
    this.timer.saveTime();
    this.isRunning = false;
  }

  @action resetTimer() {
    this.timer.reset();
    this.laps = [];
    this.isRunning = false;
  }

}
