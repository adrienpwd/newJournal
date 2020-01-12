import React, { Fragment } from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import { useSelector } from 'react-redux'

import Form from './Form'

import { Review, Trade } from 'components'

export default function Import() {
  let match = useRouteMatch()
  const data = useSelector(state => state.importReducer)
  const aggregatedTrades = data.aggregatedTrades

  return (
    <Switch>
      <Route path={`${match.path}/:tradeId`}>
        <Trade />
      </Route>
      <Route path={match.path}>
        <Form />
        <Review data="import" trades={aggregatedTrades} />
      </Route>
    </Switch>
  )
}
