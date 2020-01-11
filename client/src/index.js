import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import configureStore from './store/configureStore'

import 'core-js/stable'
import 'regenerator-runtime/runtime'

import './index.scss'

import { App } from 'components'

const store = configureStore()

const app = (
  <Provider store={store}>
    <App />
  </Provider>
)

ReactDOM.render(app, document.getElementById('root'))
