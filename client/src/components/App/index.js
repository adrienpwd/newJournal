import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { Navbar } from 'components/Common';
import {
  Dashboard,
  Import,
  Review,
  Overviews,
  Trade,
  Tradebook,
  Utils
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
              <Trade />
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
            <Route path="/utils">
              <Utils />
            </Route>
          </Switch>
        </div>
      </>
    </Router>
  );
}
