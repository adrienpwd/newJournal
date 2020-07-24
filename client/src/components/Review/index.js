import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { TradeCard } from 'components/Common'
import { Carousel } from 'react-responsive-carousel'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { Button, Form, TextArea, FileUploaderButton, Loading } from 'carbon-components-react'
import { Edit16, Checkmark16, Close16 } from '@carbon/icons-react'

import { uploadImages } from 'actions/trades'
import { editOverview, loadOverview } from 'actions/overviews'

import styles from './review.module.css'

export default function Review() {
  const dispatch = useDispatch()
  const myTrades = useSelector((state) => state.tradeReducer)?.trades
  const { day } = useParams()

  useEffect(() => {
    dispatch(loadOverview(day))
  }, [])

  const overviewState = useSelector((state) => state.overviewReducer)?.overviews[day]
  const isLoading = overviewState?.loading
  const isLoaded = overviewState?.loaded
  const overview = overviewState?.overview || {}

  const tradesReview = myTrades[day]

  const [isEditMode, setEditMode] = useState(false)

  const { register, handleSubmit } = useForm()

  const [images, setImages] = useState([])

  useEffect(() => {
    if (overview?.img) {
      overview.img.forEach((i) => {
        const imgArr = i.split('-')
        const path = `${imgArr[2]}/${imgArr[1]}/${imgArr[0]}`
        const filename = i
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
  }, [isLoading])

  function makeEditState() {
    setEditMode(true)
  }

  function makeViewState() {
    setEditMode(false)
  }

  const onSubmit = (data) => {
    dispatch(editOverview(overview, data))
    makeViewState()
  }

  const _handleUploadImages = (e) => {
    const formData = new FormData()

    const files = e.target.files

    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const imageName = `${day}/${i}`
        formData.append(imageName, files[i], imageName)
      }

      dispatch(uploadImages(formData, 'overview', day))

      //fileUploader.clearFiles()
    }
  }

  const renderImages = function () {
    const overviewImages = images.map((img, i) => {
      return (
        <div key={i}>
          <img src={URL.createObjectURL(img)} />
        </div>
      )
    })

    return <Carousel autoPlay={false}>{overviewImages}</Carousel>
  }

  const renderTradesCard = () =>
    tradesReview.map((trade) => <TradeCard key={trade.id} trade={trade} />)

  let display

  if (isEditMode) {
    display = (
      <div className={styles.editContainer}>
        <div className={styles.buttonsRow}>
          <FileUploaderButton
            className={styles.uploadButton}
            buttonKind="tertiary"
            accept={['.jpg', '.png']}
            size="small"
            labelText="Images"
            multiple
            //ref={(node) => (fileUploader = node)}
            onChange={_handleUploadImages}
          />
          <Button
            className={styles.editButton}
            kind="primary"
            size="small"
            onClick={handleSubmit(onSubmit)}
            hasIconOnly
            renderIcon={Checkmark16}
            iconDescription="Validate trade details"
            tooltipPosition="bottom"
          />
          <Button
            className={styles.editButton}
            kind="danger"
            size="small"
            onClick={makeViewState}
            hasIconOnly
            renderIcon={Close16}
            iconDescription="Cancel"
            tooltipPosition="bottom"
          />
        </div>
        <Form>
          <TextArea
            ref={register}
            cols={50}
            id="description"
            name="description"
            invalidText="Invalid error message."
            labelText="Overview"
            placeholder="Enter overview description"
            rows={4}
          />
        </Form>
      </div>
    )
  } else {
    display = (
      <div>
        <Button
          className={styles.editButton}
          kind="tertiary"
          size="small"
          onClick={makeEditState}
          hasIconOnly
          renderIcon={Edit16}
          iconDescription="Edit overview"
          tooltipPosition="bottom"
        />
        <p>{overview?.description}</p>
        <div className={styles.tradeCards}>{renderTradesCard()}</div>
        <div>{renderImages()}</div>
      </div>
    )
  }

  return isLoading && !isLoaded ? (
    <Loading active small={false} withOverlay={true} />
  ) : (
    <div className={styles.reviewContainer}>{display}</div>
  )
}
