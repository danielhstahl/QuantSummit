import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import HoldContainer from './ErrorTextField'
//injectTapEventPlugin();
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MuiThemeProvider><HoldContainer /></MuiThemeProvider>, div);
});

//it('renders when waiting')