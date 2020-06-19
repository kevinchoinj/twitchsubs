import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {Provider} from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import Store, { history } from './store';
import {Route} from 'react-router-dom';

const StoreInstance = Store();

ReactDOM.render(
  <Provider store={StoreInstance}>
    <ConnectedRouter history={history}>
      <Route component={App} />
    </ConnectedRouter>
  </Provider>
  , document.getElementById('root'));