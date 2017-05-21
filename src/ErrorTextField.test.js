import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import ErrorTextField from './ErrorTextField'

it('renders ErrorTextField without crashing', () => {
  const div = document.createElement('div');
  //injectTapEventPlugin();
  ReactDOM.render(<MuiThemeProvider><ErrorTextField label='label' regex={/stuff/g} errMsg="error" onChange={()=>{}} /></MuiThemeProvider>, div);
});