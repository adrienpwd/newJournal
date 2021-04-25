import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { Navbar, TradeOrSeed } from 'components/Common';
import {
  Dashboard,
  Import,
  Review,
  Overviews,
  Tradebook,
  Utils,
  Strategy
} from './../';

import styles from './app.module.css';

export default function App() {
  return (
    <Router>
      <>
        <Navbar />
        <div className={styles.container}>
          <Switch>
            <Route path="/overviews">
              <Overviews />
            </Route>
            <Route path="/import">
              <Import />
            </Route>
            <Route path="/review/:day/:tradeId">
              <TradeOrSeed />
            </Route>
            <Route path="/review/:day">
              <Review />
            </Route>
            <Route path="/dashboard">
              <Dashboard />
            </Route>
            <Route path="/tradebook">
              <Tradebook />
            </Route>
            <Route path="/strategy">
              <Strategy />
            </Route>
            <Route path="/utils">
              <Utils />
            </Route>
          </Switch>
        </div>
      </>
    </Router>
  );
}
