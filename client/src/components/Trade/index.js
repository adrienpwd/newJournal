import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { loadTrades } from './../../actions/trades'

import { catalysts, strategies, filterFormValues } from './../../utils'

import {
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Button,
  Checkbox,
  FileUploaderButton,
  Form,
  FormGroup,
  Select,
  SelectItem,
  NumberInput,
  Tabs,
  Tab,
  TextArea,
  Tag
} from 'carbon-components-react'

import { Edit16, Checkmark16, Close16 } from '@carbon/icons-react'

import { editTrade, uploadImages } from 'actions/trades'

import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { Carousel } from 'react-responsive-carousel'

import styles from './trade.module.css'

const ReviewTrade = () => {
  const dispatch = useDispatch()
  const { tradeId, day } = useParams()

  const data = useSelector((state) => state.tradeReducer)
  const { loaded } = data
  const trades = data.trades?.[day] || []
  const trade = trades.find((t) => t.id === tradeId)

  let catalystsCheckboxes = {}
  trade &&
    trade.catalysts &&
    trade.catalysts.map((c) => {
      catalystsCheckboxes[c] = true
    })

  const defaultValues = {
    strategy: trade?.strategy || '',
    description: trade?.description || '',
    ...catalystsCheckboxes
  }
  const { register, handleSubmit, reset } = useForm({ defaultValues })

  useEffect(() => {
    if (!loaded) {
      dispatch(loadTrades())
    }
  }, [reset])

  const [images, setImages] = useState([])

  useEffect(() => {
    if (trade?.img) {
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
    }
  }, [])

  const [isEditMode, setEditMode] = useState(false)

  function makeEditState() {
    setEditMode(true)
  }

  function makeViewState() {
    setEditMode(false)
  }

  const onSubmit = (data) => {
    const tradeCatalysts = catalysts.filter((c) => data[c.id] === true).map((c) => c.id)
    const filteredFormValues = {}
    Object.keys(data).forEach((key) => {
      if (filterFormValues(data[key])) {
        filteredFormValues[key] = data[key]
      }
    })
    if (tradeCatalysts.length) {
      filteredFormValues.catalysts = tradeCatalysts
    }

    dispatch(editTrade(trade, filteredFormValues))
    makeViewState()
  }

  const _handleUploadImages = (e) => {
    const formData = new FormData()

    const files = e.target.files

    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const imageName = `${tradeId}-${i}`
        formData.append(imageName, files[i], imageName)
      }

      dispatch(uploadImages(formData, 'trade', day))
    }
  }

  const renderImages = function () {
    const tradeImages = images.map((img, i) => {
      return (
        <div key={i}>
          <img src={URL.createObjectURL(img)} />
          {/*<p className="legend">Legend</p>*/}
        </div>
      )
    })

    return <Carousel autoPlay={false}>{tradeImages}</Carousel>
  }

  const getOrderType = (order) => {
    if (order.is_stop) {
      return 'Stop'
    } else if (order.type === 'B') {
      return 'Buy'
    } else if (order.type === 'S') {
      return 'Sell'
    } else if (order.type === 'S' && order.short) {
      return 'Short'
    }
  }

  //   <TableHead>
  //   <TableRow>
  //     {headers.map((header) => (
  //       <TableHeader {...getHeaderProps({ header })}>{header.header}</TableHeader>
  //     ))}
  //   </TableRow>
  // </TableHead>

  const renderActions = () => {
    const headersData = [
      {
        key: 'category',
        header: 'Category'
      },
      ,
      {
        key: 'time',
        header: 'Time'
      },
      {
        key: 'market_type',
        header: 'Market'
      },
      {
        key: 'type',
        header: 'Type'
      },
      {
        key: 'qty',
        header: 'Qty'
      },
      {
        key: 'init_price',
        header: 'Price'
      },
      {
        key: 'commissions',
        header: 'Commissions'
      },
      {
        key: 'slippage',
        header: 'Slippage'
      }
    ]
    return (
      <DataTable
        rows={trade.actions}
        headers={headersData}
        render={({ rows, headers, getHeaderProps, getTableProps, getRowProps }) => (
          <Table {...getTableProps()} size="short" stickyHeader style={{ maxHeight: 500 }}>
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableHeader {...getHeaderProps({ header })}>{header.header}</TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {trade.actions.map((row, i) => {
                const className = row.category === 1 ? styles.tradeRow : ''
                return (
                  <TableRow {...getRowProps({ row })} className={className} id={i}>
                    <TableCell id="category" key="category">
                      {row.category === 0 ? 'Order' : 'Trade'}
                    </TableCell>
                    <TableCell id="time" key="time">
                      {row.time}
                    </TableCell>
                    <TableCell id="market_type" key="market_type">
                      {row.market_type}
                    </TableCell>
                    <TableCell id="type" key="type">
                      {getOrderType(row)}
                    </TableCell>
                    <TableCell id="qty" key="qty">
                      {row.qty}
                    </TableCell>
                    <TableCell id="price" key="price">
                      {row.is_stop ? row.stop_price : row.price}
                    </TableCell>
                    <TableCell id="commissions" key="commissions">
                      {row.commissions}
                    </TableCell>
                    <TableCell id="slippage" key="slippage">
                      {row.slippage}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      />
    )
    // return trade.actions.map((action, i) => {
    //   let actionType
    //   // TODO:
    //   // Change this so I can also see if the Order Buy, Sell, Short, Cover was using Limit or Market
    //   if (action.is_stop || (action.market_type === 'Lmt' && !action.init_price)) {
    //     actionType = `${action.action_type} ${action.qty} at $${
    //       action.market_type === 'Mkt' ? action.stop_price : action.price
    //     }`
    //   } else {
    //     actionType = `${action.action_type} ${action.qty} at $${action.init_price} (filled: $${action.price})`
    //   }

    //   const time = (action.filled_time || action.time).split(' ')[1]

    //   return (
    //     <div key={i} className={styles.tradeAreaAction}>
    //       <span className={action.filled ? styles.tradeFilled : ''}>
    //         {time} - {actionType} {action.filled && `- commissions $${action.commissions}`}
    //         {action.order_risk && ` - risk $${action.order_risk}`}
    //       </span>
    //     </div>
    //   )
    // })
  }

  const renderCatalystsTag = () => {
    return trade?.catalysts
      ? trade?.catalysts.map((c) => (
          <Tag key={c} type="red" title={c}>
            {c}
          </Tag>
        ))
      : false
  }

  const renderEditView = function () {
    return (
      <>
        <div className={styles.tradeHeader}>
          <h2>{trade.ticker}</h2>
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
        <h4>{trade.account}</h4>
        <h4>{trade.time}</h4>
        <h4>{trade.gross_gain}</h4>
        <h4>R: {trade.r}</h4>
        <h4>slippage: {trade.slippage}</h4>

        <Form>
          <Select
            ref={register}
            id="strategy"
            name="strategy"
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
                <Checkbox
                  ref={register}
                  labelText={c.label}
                  id={c.id}
                  name={c.id}
                  key={c.id}
                  //defaultChecked={trade.catalysts.includes(c.id)}
                />
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
            value={Number(trade?.rvol)}
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
            value={Number(trade.rating)}
          />
          <NumberInput
            ref={register}
            id="commissions"
            name="commissions"
            invalidText="Number is not valid"
            label="Commissions"
            min={0}
            step={1}
            value={Number(trade?.commissions)}
          />
        </Form>
      </>
    )
  }

  const renderNormalView = function () {
    let gainClass
    if (trade.r >= 1) {
      gainClass = styles.positive
    } else if (trade.r <= 1 && trade.r >= -1) {
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
            kind="tertiary"
            size="small"
            onClick={makeEditState}
            hasIconOnly
            renderIcon={Edit16}
            iconDescription="Edit trade details"
            tooltipPosition="bottom"
          />
        </div>
        <h4>Account: {trade.account}</h4>
        <br />
        <h4>Trade entry: {trade.time}</h4>
        <h4>Duration: {trade.duration}</h4>
        <br />
        <h4>
          Gain: <span className={gainClass}>${trade.gross_gain}</span>
        </h4>
        <h4>Net: ${trade?.net_gain}</h4>
        <h4>Total Shares: {trade?.nb_shares}</h4>
        <h4>
          Commissions:
          {trade.ratio_com_gain
            ? ` $${trade.commissions} (${Math.round(trade.ratio_com_gain * 10000) / 100}%)`
            : ' n/a'}
        </h4>
        <h4>Slippage: ${trade?.slippage}</h4>
        <br />
        <h4>R/R: {trade?.r}</h4>
        <h4>
          Stop distance:
          {`${trade.stop_distance} (${Math.round(trade.stop_ratio * 10000) / 100}%)`}
        </h4>
        <h4>Risk amount: ${trade?.risk}</h4>
        <br />
        <h4>Strategy: {strategy?.label}</h4>
        <h4>Description:</h4>
        <p>{trade?.description}</p>
        <h4>Catalysts:</h4>
        {renderCatalystsTag()}
        <h4>RVOL: {trade?.rvol}</h4>
        <h4>Rating: {trade?.rating}</h4>
      </>
    )
  }

  if (trade) {
    return (
      <Tabs>
        <Tab id="view" label="View">
          <div className={styles.container}>
            <div className={styles.tradeArea}>
              <div className={styles.tradeAreaDetails}>
                {isEditMode ? renderEditView() : renderNormalView()}
              </div>
              <div className={styles.tradeAreaActions}>
                <h2>Actions</h2>
                {trade?.actions && renderActions()}
              </div>
            </div>
            <div className={styles.imagesArea}>
              <div>{renderImages()}</div>
            </div>
          </div>
        </Tab>
        <Tab id="review" label="Review">
          <div className="some-content">Review</div>
        </Tab>
      </Tabs>
    )
  } else {
    return 'Loading'
  }
}

export default ReviewTrade
