import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import axios from 'axios'

import { catalysts, strategies } from './../../utils'

import {
  Button,
  Checkbox,
  FileUploader,
  Form,
  FormGroup,
  Select,
  SelectItem,
  NumberInput,
  TextArea,
  Tag
} from 'carbon-components-react'
import { Edit16, Checkmark16, Close16 } from '@carbon/icons-react'

import { editTrade, uploadImages } from 'actions/trades'

import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { Carousel } from 'react-responsive-carousel'

import styles from './trade.module.css'

export default function ReviewTrade() {
  const dispatch = useDispatch()
  const { tradeId, day } = useParams()

  const data = useSelector((state) => state.tradeReducer)
  const trades = data.trades?.[day]
  const trade = trades.find((t) => t.id === tradeId)

  const [images, setImages] = useState([])

  useEffect(() => {
    trade.img.forEach((i) => {
      const imgArr = i.split('/')
      const path = `${imgArr[0]}/${imgArr[1]}/${imgArr[2]}`
      const filename = imgArr[3]
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
  }, [])

  let fileUploader

  const [isEditMode, setEditMode] = useState(false)

  let catalystsCheckboxes = {}
  trade.catalysts.map((c) => {
    catalystsCheckboxes[c] = true
  })

  const { register, handleSubmit } = useForm({
    defaultValues: {
      strategy: trade?.strategy || '',
      description: trade?.description || '',
      ...catalystsCheckboxes
    }
  })

  function makeEditState() {
    setEditMode(true)
  }

  function makeViewState() {
    setEditMode(false)
  }

  const onSubmit = (data) => {
    const tradeCatalysts = catalysts.filter((c) => data[c.id] === true).map((c) => c.id)
    data.catalysts = tradeCatalysts
    dispatch(editTrade(trade, data))
    makeViewState()
  }

  const _handleUpload = (e) => {
    const formData = new FormData()

    const files = e.target.files

    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const imageName = `${tradeId}-${i}`
        formData.append(imageName, files[i], imageName)
      }

      dispatch(uploadImages(formData))

      fileUploader.clearFiles()
    }
  }

  const renderImages = function () {
    // <img src={URL.createObjectURL(images)} />
    const tradeImages = images.map((img, i) => {
      return (
        <div key={i}>
          <img src={URL.createObjectURL(img)} />
          <p className="legend">Legend</p>
        </div>
      )
    })

    return <Carousel autoPlay={false}>{tradeImages}</Carousel>
  }

  const renderActions = function () {
    return trade.actions.map((action, i) => (
      <div key={i} className={styles.tradeAreaAction}>
        {action.is_stop || (action.market_type === 'Lmt' && !action.init_price)
          ? `${action.action_type} ${action.qty} shares at ${
              action.market_type === 'Mkt' ? action.stop_price : action.price
            }`
          : `${action.action_type} ${action.qty} shares at ${action.price} (init. price: ${action.init_price})`}
      </div>
    ))
  }

  const renderEditView = function () {
    return (
      <>
        <div className={styles.tradeHeader}>
          <h2>{trade.ticker}</h2>
          <Button
            className={styles.editButton}
            kind="primary"
            onClick={handleSubmit(onSubmit)}
            hasIconOnly
            renderIcon={Checkmark16}
            iconDescription="Validate trade details"
            tooltipPosition="bottom"
          />
          <Button
            className={styles.editButton}
            kind="primary"
            onClick={makeViewState}
            hasIconOnly
            renderIcon={Close16}
            iconDescription="Cancel"
            tooltipPosition="bottom"
          />
        </div>
        <h4>{trade.account}</h4>
        <h4>{trade.time}</h4>
        <h4>{trade.gain}</h4>
        <h4>R: {trade.r}</h4>
        <h4>slippage: {trade.slippage}</h4>

        <Form>
          <Select
            ref={register}
            id="strategy"
            name="strategy"
            defaultValue=""
            invalidText="This is an invalid error message."
            labelText="Strategy"
          >
            {strategies.map((s) => (
              <SelectItem text={s.label} value={s.id} key={s.id} />
            ))}
          </Select>
          <TextArea
            ref={register}
            cols={50}
            id="description"
            name="description"
            invalidText="Invalid error message."
            labelText="Description"
            placeholder="Enter trade description"
            rows={4}
          />
          <FormGroup legendText="Catalysts">
            {catalysts.map((c) => {
              return (
                <Checkbox ref={register} labelText={c.label} id={c.id} name={c.id} key={c.id} />
              )
            })}
          </FormGroup>
          <NumberInput
            ref={register}
            id="rvol"
            name="rvol"
            invalidText="Number is not valid"
            label="Relative Volume"
            min={0}
          />
          <NumberInput
            ref={register}
            id="rating"
            name="rating"
            invalidText="Number is not valid"
            label="Rate Trade"
            min={0}
            max={5}
            step={1}
          />
        </Form>
      </>
    )
  }

  const renderNormalView = function () {
    let gainClass
    if (trade.r >= 2) {
      gainClass = styles.positive
    } else if (trade.r < 2 && trade.r >= 0) {
      gainClass = styles.neuter
    } else {
      gainClass = styles.negative
    }
    const strategy = strategies.find((s) => s.id === trade.strategy)
    return (
      <>
        <div className={styles.tradeHeader}>
          <h2>{trade.ticker}</h2>
          <Button
            className={styles.editButton}
            kind="primary"
            onClick={makeEditState}
            hasIconOnly
            renderIcon={Edit16}
            iconDescription="Edit trade details"
            tooltipPosition="bottom"
          />
        </div>
        <h4>{trade.account}</h4>
        <h4>Trade entry</h4>
        <h4>{trade.time}</h4>
        <h4>Duration</h4>
        <h4>{trade.duration}</h4>
        <h4 className={gainClass}>{trade.gain}</h4>
        <h4>R/R: {trade?.r}</h4>
        <h4>slippage: {trade?.slippage}</h4>
        <h4>strategy: {strategy?.label}</h4>
        <h4>trade description:</h4>
        <p>{trade?.description}</p>
        <h4>catalysts</h4>
        {trade?.catalysts.map((c) => (
          <Tag key={c} type="red" title={c}>
            {c}
          </Tag>
        ))}
        <h4>RVOL: {trade?.rvol}</h4>
        <h4>Rating: {trade?.rating}</h4>
      </>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.tradeArea}>
        <div className={styles.tradeAreaDetails}>
          {isEditMode ? renderEditView() : renderNormalView()}
        </div>
        <div className={styles.tradeAreaActions}>
          <h2>Actions</h2>
          {renderActions()}
        </div>
      </div>
      <div className={styles.imagesArea}>
        <Form id="importInput">
          <FileUploader
            accept={['.jpg', '.png']}
            labelDescription="Import Images"
            buttonLabel="Import"
            multiple
            ref={(node) => (fileUploader = node)}
            onChange={_handleUpload}
          />
        </Form>
        {renderImages()}
      </div>
    </div>
  )
}
