import React from 'react'
import { Link, useRouteMatch } from 'react-router-dom'
import { strategies } from './../../../utils'

import styles from './tradeCard.module.css'

export default function TradeCard({ trade, url }) {
  let match = useRouteMatch()

  const getTradeType = function (type) {
    if (type === 'B') return 'Long'
    if (type === 'S') return 'Short'
  }

  let gainClass
  if (trade.r >= 2) {
    gainClass = styles.positive
  } else if (trade.r < 2 && trade.r >= 0) {
    gainClass = styles.neuter
  } else {
    gainClass = styles.negative
  }
  const strategy = strategies.find((s) => trade.strategy === s.id)

  return (
    <Link to={`/review/${match.params.day}/${trade.id}`}>
      <div title={trade.ticker} className={styles.container}>
        <div className={styles.card}>
          <h2>{trade.ticker}</h2>
          <div className={styles.element}>{trade.time}</div>
          <div className={styles.element}>{trade.account}</div>
          <div className={styles.element}>{strategy?.label}</div>
          <div className={styles.element}>{getTradeType(trade.type)}</div>
          <div className={styles.element + ' ' + gainClass}>{trade.gain}</div>
        </div>
      </div>
    </Link>
  )
}
