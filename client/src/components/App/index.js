import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import { Navbar } from 'components/Common'
import { Home, Import, Review, Trades, Trade } from './../'

import styles from './app.module.css'

export default function App() {
  return (
    <Router>
      <>
        <Navbar />
        <div className={styles.container}>
          <Switch>
            <Route path="/trades">
              <Trades />
            </Route>
            <Route path="/import">
              <Import />
            </Route>
            <Route path="/review/:day/:tradeId">
              <Trade />
            </Route>
            <Route path="/review/:day">
              <Review />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </>
    </Router>
  )
}
