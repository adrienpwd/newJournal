import React, { useEffect, useState } from 'react'
import { loadTrades } from './../../actions/trades'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, DatePicker, DatePickerInput } from 'carbon-components-react'
import { getDayOfWeek, getMonth } from './../../utils'

import styles from './trades.module.css'

export default function Trades() {
  const data = useSelector((state) => state.tradeReducer)
  const dispatch = useDispatch()
  const tradesByDay = data.trades || []

  const [dateRange, setDateRange] = useState({ start: undefined, end: undefined })

  useEffect(() => {
    dispatch(loadTrades())
  }, [])

  const handleDateChange = (range) => {
    const [start, end] = range
    setDateRange({ start: start?.getTime() / 1000, end: end?.getTime() / 1000 })
  }

  const handleSubmitDateRange = () => {
    dispatch(loadTrades(dateRange.start, dateRange.end))
  }

  const renderCalendar = () => {
    return (
      <DatePicker
        id="date-picker"
        dateFormat="d/m/Y"
        datePickerType="range"
        light={false}
        locale="en"
        onChange={handleDateChange}
        onClose={function noRefCheck() {}}
        short={false}
      >
        <DatePickerInput
          className="some-class"
          disabled={false}
          iconDescription="Icon description"
          id="date-picker-input-id-start"
          invalid={false}
          invalidText="A valid value is required"
          labelText="Starting date"
          onChange={function noRefCheck() {}}
          onClick={function noRefCheck() {}}
          pattern="d{1,2}/d{4}"
          placeholder="dd/mm/yyyy"
          size={undefined}
          type="text"
        />
        <DatePickerInput
          className="some-class"
          disabled={false}
          iconDescription="Icon description"
          id="date-picker-input-id-end"
          invalid={false}
          invalidText="A valid value is required"
          labelText="Ending Date"
          onChange={function noRefCheck() {}}
          onClick={function noRefCheck() {}}
          pattern="d{1,2}/d{4}"
          placeholder="dd/mm/yyyy"
          size={undefined}
          type="text"
        />
      </DatePicker>
    )
  }

  const renderDay = function (dayString) {
    const dayArr = dayString.split('-')
    const year = dayArr[2]
    const month = dayArr[1] - 1
    const day = dayArr[0]
    const date = new Date(year, month, day)
    const dayOfWeekIndex = date.getDay()
    const monthIndex = date.getMonth()

    const dateString = `${getDayOfWeek(dayOfWeekIndex)} ${Number(day)} ${getMonth(
      monthIndex
    )} ${date.getFullYear()}`

    return (
      <Link key={day} to={`review/${dayString}`} className={styles.tradeLink}>
        {dateString}
      </Link>
    )
  }

  return (
    <div>
      <div className={styles.calendarContainer}>
        {renderCalendar()}
        <Button
          className={styles.submitButton}
          kind="primary"
          size="small"
          onClick={handleSubmitDateRange}
          tooltipPosition="bottom"
        >
          Submit
        </Button>
      </div>
      <div className={styles.tradeContainer}>
        <h3>Trades:</h3>
        <div className={styles.tradesList}>
          {Object.keys(tradesByDay).map((day) => renderDay(day))}
        </div>
      </div>
    </div>
  )
}
