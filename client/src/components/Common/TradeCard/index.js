import React from 'react'
import { Link, useRouteMatch } from 'react-router-dom'
import { strategies } from './../../../utils'
import { ArrowDownRight16, ArrowUpRight16, WarningAlt16 } from '@carbon/icons-react'

import styles from './tradeCard.module.css'

export default function TradeCard({ trade, url }) {
  let match = useRouteMatch()

  const getTradeType = (type) => (type === 'B' ? <ArrowUpRight16 /> : <ArrowDownRight16 />)

  let gainClass
  if (trade.r >= 1) {
    gainClass = styles.positive
  } else if (trade.r <= 1 && trade.r >= -1) {
    gainClass = styles.neuter
  } else {
    gainClass = styles.negative
  }
  const strategy = strategies.find((s) => trade.strategy === s.id)

  // Display a warning sign if the trade is missing the commissions
  // We display the gross gain if it's missing commissions, or the net gain
  // if we have it.
  const displayWarning = !trade.net_gain || isNaN(trade.net_gain)

  return (
    <Link to={`/review/${match.params.day}/${trade.id}`}>
      <div title={trade.ticker} className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.tradeHeader}>
            {trade.ticker} {displayWarning && <WarningAlt16 />}
          </h2>
          <div className={styles.element}>{trade.time}</div>
          <div className={styles.element}>{trade.account}</div>
          <div className={styles.element}>{strategy?.label}</div>
          <div className={styles.element}>{getTradeType(trade.type)}</div>
          <div className={styles.element + ' ' + gainClass}>
            {displayWarning ? trade.gross_gain : trade.net_gain}
          </div>
        </div>
      </div>
    </Link>
  )
}
