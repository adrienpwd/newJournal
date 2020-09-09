import React, { useEffect } from 'react'
import { getStats } from './../../actions/dashboard'
import { useDispatch, useSelector } from 'react-redux'
import { Loading } from 'carbon-components-react'
// import { ResponsiveLine } from '@nivo/line'

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

  // const renderDailyPnL = () => {
  //   const data = [
  //     {
  //       id: 'japan',
  //       color: 'hsl(96, 70%, 50%)',
  //       data: [
  //         {
  //           x: 'plane',
  //           y: 180
  //         },
  //         {
  //           x: 'helicopter',
  //           y: 194
  //         },
  //         {
  //           x: 'boat',
  //           y: 234
  //         },
  //         {
  //           x: 'train',
  //           y: 171
  //         },
  //         {
  //           x: 'subway',
  //           y: 53
  //         },
  //         {
  //           x: 'bus',
  //           y: 247
  //         },
  //         {
  //           x: 'car',
  //           y: 254
  //         },
  //         {
  //           x: 'moto',
  //           y: 149
  //         },
  //         {
  //           x: 'bicycle',
  //           y: 178
  //         },
  //         {
  //           x: 'horse',
  //           y: 12
  //         },
  //         {
  //           x: 'skateboard',
  //           y: 128
  //         },
  //         {
  //           x: 'others',
  //           y: 286
  //         }
  //       ]
  //     },
  //     {
  //       id: 'france',
  //       color: 'hsl(254, 70%, 50%)',
  //       data: [
  //         {
  //           x: 'plane',
  //           y: 179
  //         },
  //         {
  //           x: 'helicopter',
  //           y: 95
  //         },
  //         {
  //           x: 'boat',
  //           y: 146
  //         },
  //         {
  //           x: 'train',
  //           y: 254
  //         },
  //         {
  //           x: 'subway',
  //           y: 78
  //         },
  //         {
  //           x: 'bus',
  //           y: 250
  //         },
  //         {
  //           x: 'car',
  //           y: 250
  //         },
  //         {
  //           x: 'moto',
  //           y: 35
  //         },
  //         {
  //           x: 'bicycle',
  //           y: 178
  //         },
  //         {
  //           x: 'horse',
  //           y: 138
  //         },
  //         {
  //           x: 'skateboard',
  //           y: 8
  //         },
  //         {
  //           x: 'others',
  //           y: 252
  //         }
  //       ]
  //     },
  //     {
  //       id: 'us',
  //       color: 'hsl(121, 70%, 50%)',
  //       data: [
  //         {
  //           x: 'plane',
  //           y: 53
  //         },
  //         {
  //           x: 'helicopter',
  //           y: 247
  //         },
  //         {
  //           x: 'boat',
  //           y: 201
  //         },
  //         {
  //           x: 'train',
  //           y: 89
  //         },
  //         {
  //           x: 'subway',
  //           y: 245
  //         },
  //         {
  //           x: 'bus',
  //           y: 180
  //         },
  //         {
  //           x: 'car',
  //           y: 105
  //         },
  //         {
  //           x: 'moto',
  //           y: 38
  //         },
  //         {
  //           x: 'bicycle',
  //           y: 145
  //         },
  //         {
  //           x: 'horse',
  //           y: 240
  //         },
  //         {
  //           x: 'skateboard',
  //           y: 230
  //         },
  //         {
  //           x: 'others',
  //           y: 230
  //         }
  //       ]
  //     },
  //     {
  //       id: 'germany',
  //       color: 'hsl(251, 70%, 50%)',
  //       data: [
  //         {
  //           x: 'plane',
  //           y: 161
  //         },
  //         {
  //           x: 'helicopter',
  //           y: 118
  //         },
  //         {
  //           x: 'boat',
  //           y: 36
  //         },
  //         {
  //           x: 'train',
  //           y: 205
  //         },
  //         {
  //           x: 'subway',
  //           y: 260
  //         },
  //         {
  //           x: 'bus',
  //           y: 61
  //         },
  //         {
  //           x: 'car',
  //           y: 286
  //         },
  //         {
  //           x: 'moto',
  //           y: 26
  //         },
  //         {
  //           x: 'bicycle',
  //           y: 162
  //         },
  //         {
  //           x: 'horse',
  //           y: 187
  //         },
  //         {
  //           x: 'skateboard',
  //           y: 55
  //         },
  //         {
  //           x: 'others',
  //           y: 297
  //         }
  //       ]
  //     },
  //     {
  //       id: 'norway',
  //       color: 'hsl(125, 70%, 50%)',
  //       data: [
  //         {
  //           x: 'plane',
  //           y: 108
  //         },
  //         {
  //           x: 'helicopter',
  //           y: 173
  //         },
  //         {
  //           x: 'boat',
  //           y: 147
  //         },
  //         {
  //           x: 'train',
  //           y: 232
  //         },
  //         {
  //           x: 'subway',
  //           y: 250
  //         },
  //         {
  //           x: 'bus',
  //           y: 297
  //         },
  //         {
  //           x: 'car',
  //           y: 264
  //         },
  //         {
  //           x: 'moto',
  //           y: 256
  //         },
  //         {
  //           x: 'bicycle',
  //           y: 174
  //         },
  //         {
  //           x: 'horse',
  //           y: 1
  //         },
  //         {
  //           x: 'skateboard',
  //           y: 210
  //         },
  //         {
  //           x: 'others',
  //           y: 260
  //         }
  //       ]
  //     }
  //   ]
  //   const MyResponsiveLine = ({ data /* see data tab */ }) => (
  //     <ResponsiveLine
  //       data={data}
  //       margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
  //       xScale={{ type: 'point' }}
  //       yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
  //       axisTop={null}
  //       axisRight={null}
  //       axisBottom={{
  //         orient: 'bottom',
  //         tickSize: 5,
  //         tickPadding: 5,
  //         tickRotation: 0,
  //         legend: 'transportation',
  //         legendOffset: 36,
  //         legendPosition: 'middle'
  //       }}
  //       axisLeft={{
  //         orient: 'left',
  //         tickSize: 5,
  //         tickPadding: 5,
  //         tickRotation: 0,
  //         legend: 'count',
  //         legendOffset: -40,
  //         legendPosition: 'middle'
  //       }}
  //       colors={{ scheme: 'nivo' }}
  //       pointSize={10}
  //       pointColor={{ theme: 'background' }}
  //       pointBorderWidth={2}
  //       pointBorderColor={{ from: 'serieColor' }}
  //       pointLabel="y"
  //       pointLabelYOffset={-12}
  //       useMesh={true}
  //       legends={[
  //         {
  //           anchor: 'bottom-right',
  //           direction: 'column',
  //           justify: false,
  //           translateX: 100,
  //           translateY: 0,
  //           itemsSpacing: 0,
  //           itemDirection: 'left-to-right',
  //           itemWidth: 80,
  //           itemHeight: 20,
  //           itemOpacity: 0.75,
  //           symbolSize: 12,
  //           symbolShape: 'circle',
  //           symbolBorderColor: 'rgba(0, 0, 0, .5)',
  //           effects: [
  //             {
  //               on: 'hover',
  //               style: {
  //                 itemBackground: 'rgba(0, 0, 0, .03)',
  //                 itemOpacity: 1
  //               }
  //             }
  //           ]
  //         }
  //       ]}
  //     />
  //   )

  //   return MyResponsiveLine
  // }

  return isLoading && !isLoaded ? (
    <Loading active small={false} withOverlay={true} />
  ) : (
    <div className={styles.dasboardContainer}>
      <h4>Daily P&L:</h4>
    </div>
  )
}
