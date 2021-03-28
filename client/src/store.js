import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { connectRouter} from 'connected-react-router';
import {createBrowserHistory} from 'history';
import {createStore, combineReducers, applyMiddleware, compose} from 'redux';

import reducers from './reducers';

export const history = createBrowserHistory();

const store = (initialState) => {
  return createStore(
    combineReducers({
      ...reducers,
      router: connectRouter(history),
    }),
    initialState,
    compose(
      applyMiddleware(
        thunk,
        createLogger({
          duration: true,
          predicate: () => process.env.NODE_ENV !== 'production',
          actionTransformer: action => ({
            ...action,
            type: String(action.type),
          }),
        }),
      ),
    ),
  );
};

export default store;
