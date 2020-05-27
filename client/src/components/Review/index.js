import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Tabs, Tab } from 'carbon-components-react'
import { TradeCard } from 'components/Common'

import styles from './review.module.css'

export default function Review() {
  const myTrades = useSelector((state) => state.tradeReducer)?.trades
  const { day } = useParams()

  const tradesReview = myTrades[day]

  const renderTradesCard = () => {
    const allTrades = tradesReview.map((trade) => <TradeCard key={trade.id} trade={trade} />)
    return <div className={styles.reviewContainer}>{allTrades}</div>
  }

  return (
    <Tabs>
      <Tab id="view" label="View">
        {renderTradesCard()}
      </Tab>
      <Tab id="review" label="Review">
        <div className="some-content">Review</div>
      </Tab>
    </Tabs>
  )
}
