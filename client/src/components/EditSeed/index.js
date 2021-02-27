import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  Button,
  FileUploaderButton,
  Form,
  NumberInput,
  Select,
  SelectItem,
  TextInput,
  Toggle
} from 'carbon-components-react'
import { useForm } from 'react-hook-form'
import ReactQuill from 'react-quill'
import { strategies } from '../../utils'
import Strategy from './../Tradebook/strategy'
import { editSeed, deleteSeed } from 'actions/seeds'
import { uploadImages, deleteImage } from 'actions/trades'
import { useHistory } from 'react-router-dom'

import { Checkmark16, Edit16, Close16, TrashCan16 } from '@carbon/icons-react'

import styles from './editSeed.module.css'

export default function EditSeed(props) {
  const dispatch = useDispatch()
  const history = useHistory()

  const [tradeLong, setTradeLong] = useState(true)
  const [formValue, setFormValue] = useState('')

  const { overviewId, onClose, seed } = props

  const seedId = seed?.id

  const makeViewState = () => {
    if (!seed?.id) {
      history.push(`/review/${overviewId}`)
    } else {
      onClose()
    }
  }

  const handleDeleteSeed = () => {
    dispatch(deleteSeed(seedId))
    history.push(`/review/${overviewId}`)
  }

  const onSubmit = (data) => {
    const { ticker, strategy } = data

    const currentTime = new Date()
    const seedHours = currentTime.getHours()
    const seedMinutes =
      String(currentTime.getMinutes()).length == 2
        ? currentTime.getMinutes()
        : `0${currentTime.getMinutes()}`
    const seedDate = new Date(overviewId)
    const timestamp = (seedDate - (seedDate % 1000)) / 1000
    const time = `${seedHours}:${seedMinutes}`

    const rulesItems = ['indicators', 'confirmations', 'rules']

    const rulesRespected = {}
    Object.keys(data).forEach((key) => {
      const test = key.split('-')[0]
      if (rulesItems.includes(test)) {
        rulesRespected[key] = data[key]
      }
    })

    const seedData = {
      id: seed?.id || `${overviewId}-${ticker}-${strategy}-${timestamp}`,
      time,
      isLong: tradeLong,
      timestamp,
      description: formValue,
      rulesRespected,
      ...data
    }

    dispatch(editSeed({}, seedData))
    makeViewState()
  }

  const handleSideChange = (e) => {
    setTradeLong(e)
  }

  const _handleUploadImages = (e) => {
    const formData = new FormData()

    const files = e.target.files

    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const imageName = `${seed?.id}_${i}`
        formData.append(imageName, files[i], imageName)
      }

      dispatch(uploadImages(formData, 'seed', overviewId, seed.id))
    }
  }

  const handleDeleteScreenshot = (img) => {
    dispatch(deleteImage('seed', seed.id, img))
  }

  const renderImgList = () => {
    return seed?.img?.map((img) => {
      return (
        <div key={img} className={styles.imgEdit}>
          <div>{img}</div>
          <Button
            className={styles.deleteImgButton}
            kind="secondary"
            size="small"
            onClick={() => handleDeleteScreenshot(img)}
            hasIconOnly
            renderIcon={TrashCan16}
            iconDescription="Delete"
            tooltipPosition="left"
          />
        </div>
      )
    })
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
          register={register}
        />
      </>
    )
  }

  const defaultValues = {
    price: seed?.price
  }

  const { register, handleSubmit, reset } = useForm({ defaultValues })

  return (
    <div>
      <div className={styles.headerContainer}>
        <Button
          className={styles.editButton}
          kind="danger"
          size="small"
          onClick={handleDeleteSeed}
          hasIconOnly
          renderIcon={TrashCan16}
          iconDescription="Delete"
          tooltipPosition="bottom"
        />
        <FileUploaderButton
          className={styles.uploadButton}
          buttonKind="tertiary"
          accept={['.jpg', '.png']}
          size="small"
          labelText="Images"
          multiple
          onChange={_handleUploadImages}
        />
        <Button
          className={styles.editButton}
          kind="primary"
          size="small"
          onClick={handleSubmit(onSubmit)}
          hasIconOnly
          renderIcon={Checkmark16}
          iconDescription="Validate seed details"
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
      <ReactQuill
        theme="snow"
        value={formValue}
        onChange={setFormValue}
        defaultValue={seed?.description}
      />
      <Form>
        <TextInput
          ref={register}
          id="ticker"
          name="ticker"
          invalidText="A valid value is required"
          labelText="Ticker"
          placeholder="Enter Ticker"
          defaultValue={seed?.ticker}
        />
        <Toggle
          ref={register}
          id="side"
          name="side"
          aria-label="trade side"
          defaultToggled
          id="side-toggle"
          labelText="Long"
          onToggle={handleSideChange}
        />
        <Select
          ref={register}
          id="strategy"
          name="strategy"
          labelText="Strategy"
          invalidText="A valid value is required"
          defaultValue={seed?.strategy}
        >
          {strategies.map((s) => {
            return <SelectItem text={s.label} value={s.id} key={s.id} />
          })}
        </Select>
        <NumberInput
          ref={register}
          id="price"
          name="price"
          invalidText="Number is not valid"
          label="Price"
          min={0}
          step={1}
        />
      </Form>
      {renderStrategyRules()}

      <div>
        <span>Screenshots:</span>
        {renderImgList()}
      </div>
    </div>
  )
}
