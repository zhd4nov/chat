import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import 'babel-polyfill';

import reducers from './reducers';

import App from './components/App';

const reduxDevtools = window.__REDUX_DEVTOOLS_EXTENSION__;
const store = createStore(
  reducers,
  compose(
    applyMiddleware(thunk),
    reduxDevtools && reduxDevtools(),
  ),
);

const app = (
  <Provider store={store}>
    <App />
  </Provider>
);

render(app, document.getElementById('root'));
