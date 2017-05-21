import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import InputForm from './InputForm'
//injectTapEventPlugin();
it('renders InputForm without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MuiThemeProvider><InputForm handleSubmit={(val)=>{}}/></MuiThemeProvider>, div);
});

//it('renders when waiting')