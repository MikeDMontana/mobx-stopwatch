/*
    Here, we define our Main component, and we also provide the logic to pass certain
    observables from the Timer to our JSX.
*/

import React from 'react';
// Import the observer method, which we can access using the observer decorator (ES.next)
// Read more about decorators in mobx here: https://mobx.js.org/best/decorators.html
import {observer} from 'mobx-react';

/*
  Below, we are creating our timer's display elements.
  You can use style={{property:value}} in JSX, but I won't recommend really doing this
  On your own projects quite yet. Stick with CSS and className.
*/
const TimerDisplay = ({timer, text}) => {
  return (
    <div
      style={{
        borderBottom: '1px solid #d9dae0',
        display: 'flex',
      }}
    >
      <div
        style={{fontSize: 30,
          fontFamily: 'HelveticaNeue-UltraLight',
          color: '#7f8083',
          padding: 20,
          flex: 1,
        }}
      >
        {text}
      </div>
      <div
        style={{fontSize: 30,
          padding: 20,
          fontFamily: 'HelveticaNeue-UltraLight',
          color: '#7f8083',
        }}
      >
        {timer.display}
      </div>
    </div>
  );
};

const ButtonStyle = {
  fontFamily: 'HelveticaNeue-UltraLight',
  fontSize: 20,
  width: 72,
  height: 72,
  margin: 24,
  padding: 0,
  cursor: 'pointer',
  letterSpacing: 1,
  border: 0,
  borderRadius: '50%',
  outline: 'none',
  background: 'white',
};

/*
  Now here is our Main component. We are defining some elements for the buttons and pointing them
  to the appropriate TimerStore methods, and we are also retrieving the mainDisplay and lap data.

  Take a look in TimerStore for the methods we call below.
*/

const Main = observer(({timerStore}) => {
  //the buttons will change depending on what is happening, so let them.
  let firstButton;
  let secondButton;

  //If the timer is currently running, the buttons will be this:
  //Note: Notice the methods that we are calling to in the onClick, and how they are different
  //between the if and else.
  if (!timerStore.isRunning) {
    secondButton = (
      <button
        style={{...ButtonStyle, color: '#4bd761'}}
        onClick={() => timerStore.startTimer()}
      >
        start
      </button>
    );

    firstButton = (
      <button
        style={ButtonStyle}
        onClick={() => timerStore.resetTimer()}
      >
        reset
      </button>
    );

    if (!timerStore.hasStarted) {
      firstButton = null;
    }

  //otherwise, if the timer isn't running:
  } else {
    secondButton = (
      <button
        style={{...ButtonStyle, color: '#fd3d2a'}}
        onClick={() => timerStore.stopTimer()}
      >
        stop
      </button>
    );

    firstButton = (
      <button
        style={ButtonStyle}
        onClick={() => timerStore.lapTimer()}
      >
        lap
      </button>
    );
  }

  return (
    <div style={{fontSize: 30}}>
      <div
        style={{
          background: 'white',
          height: 120,
          fontSize: 60,
          fontFamily: 'HelveticaNeue-UltraLight',
          border: 'solid #cecfd0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'}}
      >
        {timerStore.mainDisplay}
      </div>
      <div>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          {firstButton}
          {secondButton}
        </div>
        <div>
          {timerStore.lapData.map((el) =>
            <TimerDisplay
              key={el.lap.id}
              timer={el.lap}
              text={el.text}
            />
            )}
        </div>
      </div>
    </div>
  );
});

export default Main;
