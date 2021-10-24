import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loadSeeds } from 'actions/seeds'
import { Button, Loading } from 'carbon-components-react'
import EditSeed from './../EditSeed'
import Strategy from './../Tradebook/strategy'
import { strategies } from '../../utils'
import { Carousel } from 'react-responsive-carousel'

import { Edit16 } from '@carbon/icons-react'

import styles from './seed.module.css'

export default function Seed(props) {
  const { tradeId, day } = useParams()

  function makeEditState() {
    setEditMode(true)
  }

  function makeViewState() {
    setEditMode(false)
  }

  const [isEditMode, setEditMode] = useState(false)
  const [images, setImages] = useState([])

  const seedReducer = useSelector((state) => state.seedReducer)
  const { seeds, loading, loaded } = seedReducer
  const overviewSeeds = seeds[day]

  const dispatch = useDispatch()
  const yearMonthdate = day.split('-')

  // Time given by browser can vary, be carefull it doesn't bump to a different date because of the hours
  // When we create an Overview we initialize its time to 00:00
  const dayTarget = new Date(
    Number(yearMonthdate[2]),
    Number(yearMonthdate[0] - 1),
    Number(yearMonthdate[1]),
    0,
    0,
    0,
    0
  )

  const dayStartTimestamp = dayTarget.getTime()
  const dayStartUnixTime = dayStartTimestamp / 1000
  const dayEndUnixTime = dayStartUnixTime + 24 * 60 * 60

  useEffect(() => {
    if (!overviewSeeds) {
      dispatch(loadSeeds(dayStartUnixTime, dayEndUnixTime))
    }
  }, [overviewSeeds, dayStartUnixTime, dayEndUnixTime])

  let seed
  if (tradeId === 'create-new-seed') {
    seed = {}
  } else {
    seed = overviewSeeds?.length ? overviewSeeds.find((s) => s.id === tradeId) : {}
  }

  useEffect(() => {
    if (seed?.img) {
      seed.img.forEach((i) => {
        const imgArr = i.split('-')
        const imgIndex = i.split('_')[1]
        const path = `${imgArr[2]}/${imgArr[0]}/${imgArr[1]}`
        const filename = `${seed.id}_${imgIndex}`

        axios({
          method: 'get',
          url: `${process.env.REACT_APP_USERS_SERVICE_URL}/importImages`,
          params: {
            filename,
            path
          },
          responseType: 'blob'
        }).then((response) => {
          setImages((images) => images.concat(response.data))
        })
      })
    }
  }, [loading, loaded, seed])

  const strategy = strategies.find((s) => seed?.strategy === s.id)

  function createMarkup() {
    return { __html: seed?.description }
  }

  const renderStrategy = () => {
    const strategyClass = strategy?.label ? null : styles.strategyMissing
    return <div className={strategyClass}>Strategie: {strategy?.label || 'Strategy Missing'}</div>
  }

  const renderStrategyRules = () => {
    const rulesRespected = seed?.rulesRespected || []
    return (
      <>
        <p>Did you respect all the rules and criterias ?</p>
        <Strategy
          type="seed"
          strategyId={seed?.strategy}
          isEditMode={false}
          seedRulesRespected={rulesRespected}
          tradeRulesRespected={[]}
        />
      </>
    )
  }

  const getTradeType = (isLong) => {
    if (isLong === true) {
      return 'Long'
    } else if (isLong === false) {
      return 'Short'
    } else {
      return ''
    }
  }

  const handleCloseSeed = () => {
    makeViewState()
  }

  const renderImages = function () {
    const seedImages = images.map((img, i) => {
      return (
        <div key={i}>
          <img alt="seed" src={URL.createObjectURL(img)} />
        </div>
      )
    })

    return <Carousel autoPlay={false}>{seedImages}</Carousel>
  }

  const renderSeed = () => {
    return (
      <>
        {isEditMode || tradeId === 'create-new-seed' ? (
          <EditSeed overviewId={day} onClose={handleCloseSeed} seed={seed} />
        ) : (
          <>
            <Button
              className={styles.editButton}
              kind="primary"
              size="small"
              onClick={makeEditState}
              hasIconOnly
              renderIcon={Edit16}
              iconDescription="Edit"
              tooltipPosition="bottom"
            />
            <div className={styles.container}>
              <h2 className={styles.seedHeader}>{seed?.ticker}</h2>
              <div className={styles.element}>Side: {getTradeType(seed?.isLong)}</div>
              <div>Time: {seed?.time}</div>
              <div className={styles.element}>{renderStrategy()}</div>
              <div>Price: {`$${seed?.price}`}</div>
              <div className={styles.element}>Description:</div>
              <div dangerouslySetInnerHTML={createMarkup()} />
            </div>
            <div className={styles.imagesArea}>
              <div>{renderImages()}</div>
            </div>
            {renderStrategyRules()}
          </>
        )}
      </>
    )
  }

  return !loaded ? (
    <Loading active small={false} withOverlay={true} />
  ) : (
    <div className={styles.reviewContainer}>{renderSeed()}</div>
  )
}
