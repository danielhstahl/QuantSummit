import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import ReactTestUtils from 'react-dom/test-utils';
import { shallow, mount, render } from 'enzyme';
it('renders App without crashing', () => {
  expect(shallow(<App/>).exists()).toBeTruthy();
});