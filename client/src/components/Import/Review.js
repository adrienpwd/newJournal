import React from 'react'
import { useSelector } from 'react-redux'
import { TradeCard } from 'components/Common'

import styles from './review.module.css'

export default function Import() {
  const data = useSelector(state => state.importReducer)
  const aggregatedTrades = data.aggregatedTrades

  const allTrades = Object.keys(aggregatedTrades).map((key, index) => (
    <TradeCard key={index} trade={aggregatedTrades[key]} />
  ))

  return allTrades.length ? (
    <>
      Aggregated Trades:
      <div className={styles.reviewContainer}>{allTrades}</div>
    </>
  ) : (
    <div />
  )
}
