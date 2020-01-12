import React, { useEffect } from 'react'
import { loadTrades } from './../../actions/trades'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import styles from './trades.module.css'

export default function Trades() {
  const data = useSelector(state => state.tradeReducer)
  const dispatch = useDispatch()
  const tradesByDay = data.trades

  useEffect(() => {
    dispatch(loadTrades())
  }, [])

  const renderDay = function(day) {
    return (
      <Link key={day} to={`review/${day}`}>
        {day}
      </Link>
    )
  }

  return (
    <div>
      Trades:
      {tradesByDay && (
        <div className={styles.container}>
          {Object.keys(tradesByDay).map(day => renderDay(day))}
        </div>
      )}
    </div>
  )
}
