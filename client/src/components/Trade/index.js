import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import ReactQuill from 'react-quill';
import ReactStars from 'react-stars';
import Strategy from './../Tradebook/strategy';
import { Edit16, Checkmark16, Close16, TrashCan16 } from '@carbon/icons-react';
import {
  loadTrades,
  editTrade,
  uploadImages,
  deleteImage
} from 'actions/trades';
import { loadSeeds } from 'actions/seeds';
import { Carousel } from 'react-responsive-carousel';

import {
  catalysts,
  rulesItems,
  strategies,
  filterFormValues,
  actionsHeadersData,
  getStrategie
} from './../../utils';

import {
  DataTable,
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
  Loading,
  Select,
  SelectItem,
  NumberInput,
  Tabs,
  Tab,
  Tag
} from 'carbon-components-react';

import styles from './trade.module.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const ReviewTrade = () => {
  const dispatch = useDispatch();
  const { tradeId, day } = useParams();

  const yearMonthdate = day.split('-');

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
  );

  const dayStartTimestamp = dayTarget.getTime();
  const dayStartUnixTime = dayStartTimestamp / 1000;
  const dayEndUnixTime = dayStartUnixTime + 24 * 60 * 60;

  const data = useSelector(state => state.tradeReducer);

  const trades = data.trades?.[day] || [];
  const trade = trades.find(t => t.id === tradeId) || {};

  const seedReducer = useSelector(state => state.seedReducer);
  const { seeds } = seedReducer;
  const overviewSeeds = seeds[day];
  const mySeed = overviewSeeds?.find(s => s.linked_trades?.includes(tradeId));

  const strategy = getStrategie(mySeed?.strategy || trade?.strategy);

  const { register, handleSubmit, reset } = useForm();
  const [images, setImages] = useState([]);
  const [tradeFormValue, setTradeFormValue] = useState('');
  const [reviewFormValue, setReviewFormValue] = useState('');
  const [rating, setRating] = useState(trade.rating);
  const [isEditMode, setEditMode] = useState(false);

  useEffect(() => {
    const dayTarget = new Date(day);
    const dayStartTimestamp = dayTarget.getTime();
    const dayStartUnixTime = Math.floor(dayStartTimestamp / 1000);
    const dayEndUnixTime = dayStartUnixTime + 24 * 60 * 60;
    if (!trade?.id) {
      dispatch(loadTrades(dayStartUnixTime, dayEndUnixTime));
    }
  }, [reset]);

  useEffect(() => {
    if (trade?.img) {
      trade.img.forEach(i => {
        const imgArr = i.split('-');
        const date = new Date(Number(imgArr[1] + '000'));
        const myDay =
          date.getDate().toString().length === 2
            ? date.getDate()
            : `0${date.getDate()}`;
        const month = date.getMonth() + 1;
        const myMonth = month.toString().length === 2 ? month : `0${month}`;
        const path = `${date.getFullYear()}/${myMonth}/${myDay}`;

        axios({
          method: 'get',
          url: `${process.env.REACT_APP_USERS_SERVICE_URL}/importImages`,
          params: {
            filename: i,
            path
          },
          responseType: 'blob'
        }).then(response => {
          setImages(images => images.concat(response.data));
        });
      });
    }
  }, [trade]);

  useEffect(() => {
    if (!overviewSeeds) {
      dispatch(loadSeeds(dayStartUnixTime, dayEndUnixTime));
    }
  }, []);

  if (!trade) {
    return <Loading description="Loading trade" withOverlay={false} />;
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

  const handleDeleteScreenshot = img => {
    dispatch(deleteImage('trade', trade.id, img));
  };

  const onSubmit = data => {
    const filteredFormValues = {};
    const tradeCatalysts = catalysts
      .filter(c => data[c.id] === true)
      .map(c => c.id);
    Object.keys(data).forEach(key => {
      filteredFormValues[key] = data[key];
    });
    const rulesRespected = {};
    Object.keys(data).forEach(key => {
      const test = key.split('-')[0];
      if (rulesItems.includes(test)) {
        rulesRespected[key] = data[key];
      }
    });

    if (data.seed?.length) {
      filteredFormValues.seed = data.seed;
    }
    if (data.strategy?.length) {
      filteredFormValues.strategy = data.strategy;
    }
    if (tradeCatalysts?.length) {
      filteredFormValues.catalysts = tradeCatalysts;
    }
    if (Object.keys(rulesRespected)?.length) {
      filteredFormValues.rulesRespected = rulesRespected;
    }
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

  const renderImgList = () => {
    return trade?.img?.map(img => {
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
      );
    });
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
        headers={actionsHeadersData}
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
    return trade?.catalysts
      ? trade?.catalysts.map(c => (
          <Tag key={c} type="red" title={c}>
            {c}
          </Tag>
        ))
      : false;
  };

  const renderEditView = function () {
    return (
      <>
        <Form>
          {!mySeed && (
            <Select
              ref={register}
              id="strategy"
              name="strategy"
              labelText="Strategy"
              defaultValue={trade?.strategy}
              invalidText="A valid value is required"
            >
              {strategies.map(s => {
                return <SelectItem text={s.label} value={s.id} key={s.id} />;
              })}
            </Select>
          )}
          Description:
          <ReactQuill
            theme="snow"
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
                  defaultChecked={trade?.catalysts?.includes(c.id)}
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
        <div>
          <span>Screenshots:</span>
          {renderImgList()}
        </div>
      </>
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
                type="trade"
                strategyId={strategy?.id}
                isEditMode={isEditMode}
                tradeRulesRespected={trade?.rulesRespected}
                seedRulesRespected={mySeed?.rulesRespected}
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
