import React, { useState, useEffect } from 'react'
import { getStats, setAccount } from './../../actions/dashboard'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { Button, Dropdown, Loading, Select, SelectItem } from 'carbon-components-react'
import { CaretLeft16, CaretRight16 } from '@carbon/icons-react'
import { Line } from '@nivo/line'
import { accounts, getMonth } from './../../utils'
import { useHistory } from 'react-router-dom'

import styles from './dashboard.module.css'

export default function DashboardAll(props) {
  const dispatch = useDispatch()
  const dashboardState = useSelector((state) => state.dashboardReducer)
  const { register } = useForm()
  const history = useHistory()

  const isLoading = dashboardState?.loading
  const isLoaded = dashboardState?.loaded
  const dailyPNL = dashboardState?.dailyPNL
  const account = dashboardState?.account

  const date = new Date()
  const [selectedYear, setSelectedYear] = useState(date.getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(date.getMonth())
  const selectedMonthText = getMonth(selectedMonth)
  const firstDay = new Date(selectedYear, selectedMonth, 1)
  const lastDay = new Date(selectedYear, selectedMonth + 1, 0)

  const firstDayUnixTime = Math.floor(firstDay / 1000)
  const lastDayUnixTime = Math.floor(lastDay / 1000)

  function prevMonth() {
    setSelectedMonth(selectedMonth - 1)
  }

  function nextMonth() {
    setSelectedMonth(selectedMonth + 1)
  }

  useEffect(() => {
    dispatch(getStats(account, firstDayUnixTime, lastDayUnixTime))
  }, [account, firstDayUnixTime, lastDayUnixTime, selectedYear])

  const handleAccountChange = (e) => {
    dispatch(setAccount(e.target.value))
  }

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value)
  }

  const renderAccountSelect = () => {
    return (
      <div className={styles.dropdown}>
        <Select
          ref={register}
          onChange={handleAccountChange}
          id="account"
          name="account"
          invalidText="This is an invalid error message."
          labelText="Account"
          defaultValue={accounts[0]}
        >
          {accounts.map((s) => (
            <SelectItem text={s.label} value={s.id} key={s.id} />
          ))}
        </Select>
      </div>
    )
  }

  const renderYearSelect = () => {
    const years = [
      { id: '2020', label: '2020' },
      { id: '2021', label: '2021' }
    ]
    return (
      <div className={styles.dropdown}>
        <Select
          onChange={handleYearChange}
          id="year"
          name="year"
          invalidText="This is an invalid error message."
          labelText="Year"
          defaultValue={selectedYear}
        >
          {years.map((s) => (
            <SelectItem text={s.label} value={s.id} key={s.id} />
          ))}
        </Select>
      </div>
    )
  }

  const renderRstats = () => {
    const getRdisplay = (v) => {
      const rValue = v ? v : 0
      return (
        <span>
          {`${rValue} / ${dashboardState.totalTradesByAccount?.[account]} (${
            Math.round((rValue / dashboardState.totalTradesByAccount?.[account]) * 1000) / 10
          }%)`}
        </span>
      )
    }
    return (
      <div className={styles.rContainer}>
        <div className={styles.rItem}>
          <h4 className={styles.rHeader}>Big Losers</h4>
          <span>{getRdisplay(dashboardState?.bigLosers?.[account])}</span>
        </div>
        <div className={styles.rItem}>
          <h4 className={styles.rHeader}>Losers</h4>
          <span>{getRdisplay(dashboardState?.losers?.[account])}</span>
        </div>
        <div className={styles.rItem}>
          <h4 className={styles.rHeader}>Winners</h4>
          <span>{getRdisplay(dashboardState?.winners?.[account])}</span>
        </div>
        <div className={styles.rItem}>
          <h4 className={styles.rHeader}>Big Winners</h4>
          <span>{getRdisplay(dashboardState?.bigWinners?.[account])}</span>
        </div>
      </div>
    )
  }

  const handlePnLClick = (point, event) => {
    const day = point.data.xFormatted
    history.push(`/review/${day}`)
  }

  const getMonthlyRs = () => {
    let total = 0
    dailyPNL[1].forEach((pnl) => {
      total += pnl.y
    })

    return Math.round(total * 10) / 10
  }

  const renderDailyPnL = () => {
    const data = [
      {
        id: 'pnl',
        data: dailyPNL[0]
      }
    ]

    return (
      <Line
        colors={{ scheme: 'category10' }}
        onClick={handlePnLClick}
        width={900}
        height={250}
        margin={{ top: 20, right: 20, bottom: 20, left: 30 }}
        data={data}
        animate={true}
        enableSlices={false}
        useMesh={true}
        xScale={{ type: 'point' }}
        yScale={{
          type: 'linear',
          stacked: false,
          min: 'auto',
          max: 'auto'
        }}
        axisLeft={{
          legend: '',
          legendOffset: 0
        }}
        axisBottom={{
          orient: 'bottom'
        }}
        curve="monotoneX"
        enablePointLabel={true}
        pointSize={6}
        pointBorderWidth={1}
        pointBorderColor={{
          from: 'color',
          modifiers: [['darker', 0.3]]
        }}
        enableGridX={false}
        enableGridY
      />
    )
  }

  const renderDailyR = () => {
    const data = [
      {
        id: 'r',
        data: dailyPNL[1]
      }
    ]

    return (
      <Line
        colors={{ scheme: 'category10' }}
        account={account}
        width={900}
        height={250}
        margin={{ top: 20, right: 20, bottom: 20, left: 30 }}
        data={data}
        animate={true}
        enableSlices="x"
        data={data}
        xScale={{ type: 'point' }}
        yScale={{
          type: 'linear',
          stacked: false,
          min: 'auto',
          max: 'auto'
        }}
        axisLeft={{
          legend: '',
          legendOffset: 0
        }}
        axisBottom={{
          orient: 'bottom'
        }}
        curve="monotoneX"
        enablePointLabel={true}
        pointSize={6}
        pointBorderWidth={1}
        pointBorderColor={{
          from: 'color',
          modifiers: [['darker', 0.3]]
        }}
        enableGridX={false}
        enableGridY
      />
    )
  }

  return isLoading && !isLoaded ? (
    <Loading active small={false} withOverlay={true} />
  ) : (
    <div className={styles.dasboardContainer}>
      <div className={styles.dasboardHeader}>
        <div className={styles.nav}>
          <Button
            className={styles.navButton}
            kind="secondary"
            size="small"
            onClick={() => {
              prevMonth()
            }}
            hasIconOnly
            renderIcon={CaretLeft16}
            iconDescription="Previous"
            tooltipPosition="bottom"
          />
          <h4>Stats for {selectedMonthText}</h4>
          <Button
            className={styles.navButton}
            kind="secondary"
            size="small"
            onClick={() => {
              nextMonth()
            }}
            hasIconOnly
            renderIcon={CaretRight16}
            iconDescription="Next"
            tooltipPosition="bottom"
          />
        </div>
        <div className={styles.dropdowns}>
          {renderAccountSelect()}
          {renderYearSelect()}
        </div>
      </div>
      {renderRstats()}
      <h4>Rs:</h4>
      <div className={styles.dailyChartContainer}>{getMonthlyRs()}</div>
      <h4>Daily P&L:</h4>
      <div className={styles.dailyChartContainer}>{renderDailyPnL()}</div>
      <h4>Daily RvR:</h4>
      <div className={styles.dailyChartContainer}>{renderDailyR()}</div>
    </div>
  )
}
