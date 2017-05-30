import React from 'react';
import './App.css';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import HoldContainer from './HoldContainer'

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const App =()=>(
  <MuiThemeProvider>
    <HoldContainer/>
  </MuiThemeProvider>
);
export default App;