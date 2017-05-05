import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import InputForm from './InputForm'
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();
const App =()=>  (
  <MuiThemeProvider>
    <InputForm/>
  </MuiThemeProvider>
  
);

export default App;
