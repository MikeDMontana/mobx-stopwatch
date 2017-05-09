// Below we are importing React, as well as ReactDOM, to access it's methods.
import React from 'react';
import ReactDOM from 'react-dom';

// Import our Main component
import Main from './main';

// Import the TimerStore class from our TimerStore.js file, so that we can pass it into our Main component.
import {TimerStore} from './TimerStore';

// Always useStrict with mobx.
import {useStrict} from 'mobx';
useStrict(true);

// Create an instance of our TimerStore
const timerStore = new TimerStore();

// Render the Main component, and pass in our timerStore.
ReactDOM.render(
  <Main timerStore={timerStore}/>,
  document.getElementById('app')
);
