import React from 'react'
import { Link, useRouteMatch } from 'react-router-dom'
import classnames from 'classnames'

import { createTradeId } from 'utils'

import styles from './tradeCard.module.css'

export default function TradeCard({ trade }) {
  let match = useRouteMatch()

  const tradeId = createTradeId(trade)

  const getTradeType = function(type) {
    if (type === 'B') return 'Long'
    if (type === 'S') return 'Short'
  }

  const gainClass = trade.gain > 0 ? styles.positive : styles.negative

  return (
    <Link to={`${match.url}/${tradeId}`}>
      <div title={trade.ticker} className={styles.container}>
        <div className={styles.card}>
          <h2>{trade.ticker}</h2>
          <div className={styles.element}>{trade.time}</div>
          <div className={styles.element}>{trade.duration}</div>
          <div className={styles.element}>{getTradeType(trade.type)}</div>
          <div className={styles.element + ' ' + gainClass}>{trade.gain}</div>
        </div>
      </div>
    </Link>
  )
}
