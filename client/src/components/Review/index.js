import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { TradeCard } from 'components/Common';
import Seed from './../Seed';
import { Carousel } from 'react-responsive-carousel';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import {
  Button,
  Form,
  FileUploaderButton,
  Loading
} from 'carbon-components-react';
import { Edit16, Checkmark16, Close16 } from '@carbon/icons-react';
import ReactQuill from 'react-quill';

import 'react-quill/dist/quill.snow.css';

import { loadTrades, uploadImages } from 'actions/trades';
import { editOverview, loadOverviews } from 'actions/overviews';

import styles from './review.module.css';

export default function Review() {
  const dispatch = useDispatch();

  const tradeReducer = useSelector(state => state.tradeReducer);
  const overviewReducer = useSelector(state => state.overviewReducer);

  const { day } = useParams();

  const { trades } = tradeReducer;
  const tradesReview = trades?.[day];

  const { overviews } = overviewReducer;

  const overviewState = overviews[day];

  const [formValue, setFormValue] = useState('');

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

  useEffect(() => {
    if (!overviewState) {
      dispatch(loadOverviews(dayStartUnixTime, dayEndUnixTime));
    }
  }, []);

  useEffect(() => {
    if (!tradesReview) {
      dispatch(loadTrades(dayStartUnixTime, dayEndUnixTime));
    }
  }, []);

  const isLoading = overviewState?.loading;
  const isLoaded = overviewState?.loaded;

  const [isEditMode, setEditMode] = useState(false);

  const { register, handleSubmit } = useForm();

  const [images, setImages] = useState([]);

  useEffect(() => {
    if (overviewState?.img) {
      overviewState.img.forEach(i => {
        const imgArr = i.split('-');
        const path = `${imgArr[2]}/${imgArr[1]}/${imgArr[0]}`;
        const filename = i;
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
  }, [isLoading]);

  function makeEditState() {
    setEditMode(true);
  }

  function makeViewState() {
    setEditMode(false);
  }

  const onSubmit = () => {
    const currentOverview = overviewState || {};
    dispatch(
      editOverview(currentOverview, {
        description: formValue,
        id: day,
        timestamp: dayStartUnixTime
      })
    );
    makeViewState();
  };

  const _handleUploadImages = e => {
    const formData = new FormData();

    const files = e.target.files;

    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const imageName = `${day}/${i}`;
        formData.append(imageName, files[i], imageName);
      }

      dispatch(uploadImages(formData, 'overview', day));

      //fileUploader.clearFiles()
    }
  };

  function createMarkup() {
    return { __html: overviewState?.description };
  }

  const renderImages = function () {
    const overviewImages = images.map((img, i) => {
      return (
        <div key={i}>
          <img src={URL.createObjectURL(img)} />
        </div>
      );
    });

    return <Carousel autoPlay={false}>{overviewImages}</Carousel>;
  };

  const renderPnLbyAccount = () => {
    if (overviewState?.accounts && Object.keys(overviewState?.accounts)) {
      return Object.keys(overviewState?.accounts).map((key, i) => {
        const account = overviewState.accounts[key];
        return (
          <h4 key={i}>
            {account.account}: Gross: {account.gross} Net {account.net}
          </h4>
        );
      });
    }
  };

  const renderTradesCard = () => {
    if (tradesReview) {
      return tradesReview.map(trade => (
        <TradeCard key={trade.id} trade={trade} />
      ));
    }
  };

  let display;

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
            iconDescription="Validate overview"
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
          defaultValue={overviewState?.description}
        />
      </div>
    );
  } else {
    display = (
      <div>
        <h4>
          {dayTarget.toDateString()}
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
        </h4>
        <h4>Description</h4>
        <div dangerouslySetInnerHTML={createMarkup()} />
        {renderPnLbyAccount()}
        <Seed overviewId={day} />
        <div className={styles.tradeCards}>{renderTradesCard()}</div>
        <div>{renderImages()}</div>
      </div>
    );
  }

  return isLoading && !isLoaded ? (
    <Loading active small={false} withOverlay={true} />
  ) : (
    <div className={styles.reviewContainer}>{display}</div>
  );
}
