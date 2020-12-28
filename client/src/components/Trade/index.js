import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { loadTrades } from './../../actions/trades';
import ReactQuill from 'react-quill';
import ReactStars from 'react-stars';
import Strategy from './../Tradebook/strategy';

import {
  catalysts,
  strategies,
  filterFormValues,
  headersData,
  getStrategie
} from './../../utils';

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
} from 'carbon-components-react';

import { Edit16, Checkmark16, Close16 } from '@carbon/icons-react';

import { editTrade, uploadImages } from 'actions/trades';

import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';

import styles from './trade.module.css';

const ReviewTrade = () => {
  const dispatch = useDispatch();
  const { tradeId, day } = useParams();

  const data = useSelector(state => state.tradeReducer);
  const { loaded } = data;

  const trades = data.trades?.[day] || [];
  const trade = trades.find(t => t.id === tradeId) || {};
  const strategy = getStrategie(trade?.strategy);

  const { register, handleSubmit, reset } = useForm();
  const [images, setImages] = useState([]);
  const [tradeFormValue, setTradeFormValue] = useState('');
  const [reviewFormValue, setReviewFormValue] = useState('');
  const [rating, setRating] = useState(trade.rating);
  const [isEditMode, setEditMode] = useState(false);

  useEffect(() => {
    if (!loaded) {
      dispatch(loadTrades());
    }
  }, [reset]);

  useEffect(() => {
    if (trade?.img) {
      trade.img.forEach(i => {
        const imgArr = i.split('/');
        const path = `${imgArr[0]}/${imgArr[1]}/${imgArr[2]}`;
        const filename = imgArr[3];
        axios({
          method: 'get',
          url: `${process.env.REACT_APP_USERS_SERVICE_URL}/importImages`,
          params: {
            filename,
            path
          },
          responseType: 'blob'
        }).then(response => {
          setImages(images => images.concat(response.data));
        });
      });
    }
  }, []);

  if (!loaded) {
    return 'Loading ...';
  }

  function makeEditState() {
    setEditMode(true);
  }

  const getTradeType = type => (type === 'B' ? 'Long' : 'Short');

  function makeViewState() {
    setEditMode(false);
  }

  function createMarkup(target) {
    if (target === 'trade') {
      return { __html: trade?.description };
    } else {
      return { __html: trade?.review };
    }
  }

  const onSubmit = data => {
    const filteredFormValues = {};
    console.log('Form Data');
    console.log(data);
    Object.keys(data).forEach(key => {
      filteredFormValues[key] = data[key];
    });
    if (data.strategy.length) {
      filteredFormValues.strategy = data.strategy;
    }
    // if (tradeCatalysts.length) {
    //   filteredFormValues.catalysts = tradeCatalysts;
    // }
    if (tradeFormValue) {
      filteredFormValues.description = tradeFormValue;
    }
    if (reviewFormValue) {
      filteredFormValues.review = reviewFormValue;
    }
    if (!isNaN(rating)) {
      filteredFormValues.rating = rating;
    }

    dispatch(editTrade(trade, filteredFormValues));
    makeViewState();
  };

  const onRatingChange = newRating => {
    setRating(newRating);
  };

  const _handleUploadImages = e => {
    const formData = new FormData();

    const files = e.target.files;

    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const imageName = `${tradeId}-${i}`;
        formData.append(imageName, files[i], imageName);
      }

      dispatch(uploadImages(formData, 'trade', day));
    }
  };

  const renderImages = function () {
    const tradeImages = images.map((img, i) => {
      return (
        <div key={i}>
          <img src={URL.createObjectURL(img)} />
        </div>
      );
    });

    return <Carousel autoPlay={false}>{tradeImages}</Carousel>;
  };

  const getOrderType = order => {
    if (order.is_stop) {
      return 'Stop';
    } else if (order.type === 'B') {
      return 'Buy';
    } else if (order.type === 'S') {
      return 'Sell';
    } else if (order.type === 'S' && order.short) {
      return 'Short';
    }
  };

  const renderActions = () => {
    return (
      <DataTable
        rows={trade.actions}
        headers={headersData}
        render={({
          rows,
          headers,
          getHeaderProps,
          getTableProps,
          getRowProps
        }) => (
          <Table
            {...getTableProps()}
            size="short"
            stickyHeader
            style={{ maxHeight: 500 }}
          >
            <TableHead>
              <TableRow>
                {headers.map(header => (
                  <TableHeader {...getHeaderProps({ header })}>
                    {header.header}
                  </TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {trade.actions.map((row, i) => {
                const className = row.category === 1 ? styles.tradeRow : '';
                return (
                  <TableRow
                    {...getRowProps({ row })}
                    className={className}
                    id={i}
                  >
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
                );
              })}
            </TableBody>
          </Table>
        )}
      />
    );
  };

  const renderCatalystsTag = () => {
    const catalystsTags = [];
    catalysts.forEach(c => {
      if (trade[c.id]) {
        catalystsTags.push(
          <Tag key={c.id} type="red" title={c.label}>
            {c.label}
          </Tag>
        );
      }
    });
    return catalystsTags;
  };

  const renderEditView = function () {
    return (
      <Form>
        <Select
          ref={register}
          id="strategy"
          name="strategy"
          labelText="Strategy"
          defaultValue={trade.strategy}
          invalidText="A valid value is required"
        >
          {strategies.map(s => {
            return <SelectItem text={s.label} value={s.id} key={s.id} />;
          })}
        </Select>
        Description:
        <ReactQuill
          theme="snow"
          value={tradeFormValue}
          onChange={setTradeFormValue}
          value={tradeFormValue || trade?.description}
        />
        <FormGroup legendText="Catalysts">
          {catalysts.map(c => {
            return (
              <Checkbox
                ref={register}
                labelText={c.label}
                id={c.id}
                name={c.id}
                key={c.id}
                defaultChecked={trade[c.id]}
              />
            );
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
          id="commissions"
          name="commissions"
          invalidText="Number is not valid"
          label="Commissions"
          min={0}
          step={1}
          value={Number(trade?.commissions)}
        />
        Rating:
        <ReactStars
          count={5}
          onChange={onRatingChange}
          size={24}
          color2={'#ffd700'}
          half={false}
          value={Number(trade?.rating)}
        />
      </Form>
    );
  };

  const renderNormalView = function () {
    let gainClass;
    if (trade.r >= 1) {
      gainClass = styles.positive;
    } else if (trade.r <= 1 && trade.r >= -1) {
      gainClass = styles.neuter;
    } else {
      gainClass = styles.negative;
    }
    return (
      <>
        <div className={styles.tradeHeader}>
          <h2>{trade.ticker}</h2>
        </div>
        <h4>Account: {trade.account}</h4>
        <br />
        <h4>Side: {getTradeType(trade.type)}</h4>
        <h4>Strategy: {strategy?.label}</h4>
        <h4>Description:</h4>
        <div dangerouslySetInnerHTML={createMarkup('trade')} />
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
            ? ` $${trade.commissions} (${
                Math.round(trade.ratio_com_gain * 10000) / 100
              }%)`
            : ' n/a'}
        </h4>
        <br />
        <h4>R/R: {trade?.r}</h4>
        <h4>
          Stop distance:
          {`${trade.stop_distance} (${
            Math.round(trade.stop_ratio * 10000) / 100
          }%)`}
        </h4>
        <h4>Risk amount: ${trade?.risk}</h4>
        <h4>Slippage: ${trade?.slippage}</h4>
        <br />
        <h4>Catalysts:</h4>
        {renderCatalystsTag()}
        <h4>RVOL: {trade?.rvol}</h4>
        <h4>Rating:</h4>
        <ReactStars
          edit={false}
          count={5}
          size={24}
          color2={'#ffd700'}
          value={Number(trade.rating)}
        />
      </>
    );
  };

  if (trade) {
    return (
      <div>
        {!isEditMode && (
          <Button
            kind="tertiary"
            size="small"
            onClick={makeEditState}
            hasIconOnly
            renderIcon={Edit16}
            iconDescription="Edit trade details"
            tooltipPosition="bottom"
          />
        )}
        {isEditMode && (
          <>
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
          </>
        )}
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
            {isEditMode ? (
              <ReactQuill
                theme="snow"
                value={reviewFormValue}
                onChange={setReviewFormValue}
                defaultValue={trade?.review}
              />
            ) : (
              <div dangerouslySetInnerHTML={createMarkup('review')} />
            )}
            <>
              <p>Did you respect all the rules and criterias ?</p>
              <Strategy
                strategyId={trade?.strategy}
                isEditMode={isEditMode}
                trade={trade}
                register={register}
              />
            </>
          </Tab>
        </Tabs>
      </div>
    );
  } else {
    return 'Loading';
  }
};

export default ReviewTrade;
