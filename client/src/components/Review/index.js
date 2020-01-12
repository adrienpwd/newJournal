import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { TradeCard } from 'components/Common'

import styles from './review.module.css'

export default function Import(props) {
  const myTrades = useSelector(state => state.tradeReducer)?.trades
  const { day } = useParams()

  const { data, trades } = props
  let tradesReview
  let allTrades

  if (data === 'import') {
    tradesReview = trades
    allTrades = Object.keys(tradesReview).map((key, index) => (
      <TradeCard key={index} trade={trades[key]} url={'/import'} />
    ))
  } else {
    // data = "db"
    tradesReview = myTrades[day]
    allTrades = tradesReview.map(trade => (
      <TradeCard key={trade._id} trade={trade} url={'/review'} />
    ))
  }

  return allTrades.length ? (
    <>
      Trades:
      <div className={styles.reviewContainer}>{allTrades}</div>
    </>
  ) : (
    <div>No Trade to review</div>
  )
}
