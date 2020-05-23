import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'

import { catalysts, strategies } from './../../utils'

import {
  Button,
  Checkbox,
  FileUploader,
  Form,
  FormGroup,
  MultiSelect,
  Select,
  SelectItem,
  TextInput,
  TextArea
} from 'carbon-components-react'
import { Edit16, Checkmark16 } from '@carbon/icons-react'

import { importImages } from 'actions/trades'

import styles from './trade.module.css'

export default function ReviewTrade() {
  const dispatch = useDispatch()
  const { tradeId, day } = useParams()

  const data = useSelector((state) => state.tradeReducer)
  const trades = data.trades?.[day]
  const trade = trades.find((t) => t.id === tradeId)

  let fileUploader

  const [isEditMode, setEditMode] = useState(false)

  const { register, handleSubmit } = useForm({
    defaultValues: {
      strategy: '',
      description: ''
    }
  })

  function makeEditState() {
    setEditMode(true)
  }

  function makeViewState() {
    setEditMode(false)
  }

  const onSubmit = (data) => {
    console.log(JSON.stringify(data))
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

      dispatch(importImages(formData))

      fileUploader.clearFiles()
    }
  }

  const renderImages = function () {
    const uploadedimages = trade.img.map((i) => {
      return <img src={i} alt=""></img>
    })

    return uploadedimages
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
        </div>
        <h4>{trade.account}</h4>
        <h4>{trade.time}</h4>
        <h4>{trade.gain}</h4>
        <h4>R: {trade.r}</h4>
        <h4>slippage: {trade.slippage}</h4>

        <Form>
          <FormGroup legendText="Trade details">
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
            <legend>Catalyst(s)</legend>
            {catalysts.map((c) => (
              <Checkbox ref={register} labelText={c.label} id={c.id} name={c.id} key={c.id} />
            ))}
          </FormGroup>
        </Form>
      </>
    )
  }

  const renderNormalView = function () {
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
        <h4>{trade.time}</h4>
        <h4>{trade.gain}</h4>
        <h4>R: {trade.r}</h4>
        <h4>slippage: {trade.slippage}</h4>
        <h4>strategy: {trade.strategy}</h4>
        <h4>trade plan:</h4>
        <p>{trade.plan}</p>
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
          <FormGroup legendText="Upload">
            <FileUploader
              labelDescription="Import Images"
              buttonLabel="Import"
              multiple
              ref={(node) => (fileUploader = node)}
              onChange={_handleUpload}
            />
          </FormGroup>
        </Form>
      </div>
    </div>
  )
}
{
  /* <FormGroup>
            <TextArea
              cols={50}
              id="test5"
              invalidText="Invalid error message."
              labelText="Text Area label"
              placeholder="Placeholder text"
              rows={4}
            />
          </FormGroup>
          <FormGroup>
            <Select
              defaultValue="placeholder-item"
              id="select-1"
              invalidText="This is an invalid error message."
              labelText="Select"
            >
              <SelectItem text="Option 1" value="option-1" />
              <SelectItem text="Option 2" value="option-2" />
              <SelectItem text="Option 3" value="option-3" />
            </Select>
          </FormGroup> */
}
