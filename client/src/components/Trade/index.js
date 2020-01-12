import React from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { FileUploader, Form, FormGroup } from 'carbon-components-react'

import { importImages } from 'actions/trades'

import styles from './trade.module.css'

export default function ReviewTrade() {
  const dispatch = useDispatch()
  const { tradeId, day } = useParams()

  const data = useSelector(state => state.tradeReducer)
  const trades = data.trades?.[day]
  const trade = trades.find(t => t._id === tradeId)

  let fileUploader

  const _handleUpload = e => {
    const formData = new FormData()

    const files = e.target.files
    files.forEach((file, index) => {
      const imageName = `${tradeId}-${index}`
      formData.append(imageName, file, imageName)
    })

    dispatch(importImages(formData))

    fileUploader.clearFiles()
  }

  const renderImages = function() {
    const uploadedimages = trade.img.map(i => {
      return <img src={i} alt=""></img>
    })

    return uploadedimages
  }

  const renderActions = function() {
    return trade.actions.map((action, i) => (
      <div key={i} className={styles.tradeAreaAction}>
        {action.is_stop
          ? `${action.action_type} ${action.qty} shares at ${
              action.market_type === 'Mkt' ? action.stop_price : action.price
            }`
          : `${action.action_type} ${action.qty} shares at ${action.price} (init. price: ${action.init_price})`}
      </div>
    ))
  }

  return (
    <div className={styles.container}>
      <div className={styles.tradeArea}>
        <div className={styles.tradeAreaDetails}>
          <h2>{trade.ticker}</h2>
          <h4>{trade.time}</h4>
          <h4>{trade.gain}</h4>
        </div>
        <div className={styles.tradeAreaActions}>
          <h2>Actions</h2>
          {renderActions()}
        </div>
      </div>
      <div className={styles.imagesArea}>
        <Form id="importInput">
          <FormGroup legendText="Upload">
            <FileUploader
              labelDescription="Import Images"
              buttonLabel="Import"
              multiple
              ref={node => (fileUploader = node)}
              onChange={_handleUpload}
            />
          </FormGroup>
        </Form>
      </div>
    </div>
  )
}
