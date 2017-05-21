import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ReactTestUtils from 'react-dom/test-utils';
import HoldContainer from './HoldContainer'
import { shallow, mount, render } from 'enzyme';
it('renders HoldContainer without crashing', () => {
  expect(shallow(<MuiThemeProvider><HoldContainer/></MuiThemeProvider>).exists()).toBeTruthy();
});