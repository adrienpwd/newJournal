import React, { useEffect } from 'react'
import { getStats } from './../../actions/dashboard'
import { useDispatch, useSelector } from 'react-redux'
import { Loading } from 'carbon-components-react'

import styles from './dashboard.module.css'

export default function Dashboard() {
  const dispatch = useDispatch()
  const dashboardState = useSelector((state) => state.dashboardReducer)
  console.log(dashboardState)

  useEffect(() => {
    dispatch(getStats())
  }, [])

  const isLoading = dashboardState?.loading
  const isLoaded = dashboardState?.loaded
  const allTimeGainByAccount = dashboardState?.all_time_total_by_account

  console.log(allTimeGainByAccount)

  return isLoading && !isLoaded ? (
    <Loading active small={false} withOverlay={true} />
  ) : (
    <div className={styles.dasboardContainer}>
      <h4>All time gain:</h4>
      {/* {allTimeGainByAccount.map((allTime, i) => {
        return <h4 key={i}>{allTime.total}</h4>
      })} */}
    </div>
  )
}
