import thunkMiddleware from 'redux-thunk';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import tradeReducer from '../reducers/tradeReducer';
import dashboardReducer from '../reducers/dashboardReducer';
import overviewReducer from '../reducers/overviewReducer';
import seedReducer from '../reducers/seedReducer';
import strategyReducer from '../reducers/strategyReducer';

const enhancers = [];

if (window.__REDUX_DEVTOOLS_EXTENSION__) {
  enhancers.push(
    window.__REDUX_DEVTOOLS_EXTENSION__({ name: 'MyTradingJournal' })
  );
}

export default function configureStore() {
  const store = createStore(
    combineReducers({
      tradeReducer,
      dashboardReducer,
      overviewReducer,
      seedReducer,
      strategyReducer
    }),
    {},
    compose(applyMiddleware(thunkMiddleware), ...enhancers)
  );
  return store;
};
