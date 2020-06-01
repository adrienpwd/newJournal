import thunkMiddleware from 'redux-thunk'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import tradeReducer from '../reducers/tradeReducer'
import importReducer from '../reducers/importReducer'
import overviewReducer from '../reducers/overviewReducer'

const enhancers = []

if (window.__REDUX_DEVTOOLS_EXTENSION__) {
  enhancers.push(window.__REDUX_DEVTOOLS_EXTENSION__({ name: 'MyTradingJournal' }))
}

export default () => {
  const store = createStore(
    combineReducers({
      tradeReducer,
      importReducer,
      overviewReducer
    }),
    {},
    compose(applyMiddleware(thunkMiddleware), ...enhancers)
  )
  return store
}
