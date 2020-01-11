import React, { Fragment } from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'

import Form from './Form'
import Review from './Review'

import { Trade } from 'components'

export default function Import() {
  let match = useRouteMatch()

  return (
    <Switch>
      <Route path={`${match.path}/:tradeId`}>
        <Trade />
      </Route>
      <Route path={match.path}>
        <Form />
        <Review />
      </Route>
    </Switch>
  )
}
