import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import ErrorTextField from './ErrorTextField'

it('renders without crashing', () => {
  const div = document.createElement('div');
  //injectTapEventPlugin();
  ReactDOM.render(<MuiThemeProvider><ErrorTextField /></MuiThemeProvider>, div);
});

//it('renders when waiting')