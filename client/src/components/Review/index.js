import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { TradeCard } from 'components/Common'

import styles from './review.module.css'

export default function Review() {
  const myTrades = useSelector(state => state.tradeReducer)?.trades
  const { day } = useParams()

  const tradesReview = myTrades[day]
  const allTrades = tradesReview.map(trade => <TradeCard key={trade.id} trade={trade} />)

  return allTrades.length ? (
    <>
      Trades:
      <div className={styles.reviewContainer}>{allTrades}</div>
    </>
  ) : (
    <div>No Trade to review</div>
  )
}
