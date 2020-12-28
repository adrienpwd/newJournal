import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { TradeCard } from 'components/Common';
import { Carousel } from 'react-responsive-carousel';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import {
  Button,
  Form,
  TextArea,
  FileUploaderButton,
  Loading
} from 'carbon-components-react';
import { Edit16, Checkmark16, Close16 } from '@carbon/icons-react';
import ReactQuill from 'react-quill';

import 'react-quill/dist/quill.snow.css';

import { loadTrades, uploadImages } from 'actions/trades';
import { editOverview, loadOverview } from 'actions/overviews';

import styles from './review.module.css';

export default function Review() {
  const dispatch = useDispatch();

  const data = useSelector(state => state.tradeReducer);

  const { loaded, trades } = data;

  const { day } = useParams();

  const [formValue, setFormValue] = useState('');

  useEffect(() => {
    dispatch(loadOverview(day));
  }, []);

  useEffect(() => {
    if (!loaded) {
      dispatch(loadTrades());
    }
  }, []);

  const overviewState = useSelector(state => state.overviewReducer)?.overviews[
    day
  ];
  const isLoading = overviewState?.loading;
  const isLoaded = overviewState?.loaded;
  const overview = overviewState?.overview || {};

  const tradesReview = trades?.[day] ? trades[day] : [];

  const [isEditMode, setEditMode] = useState(false);

  const { register, handleSubmit } = useForm();

  const [images, setImages] = useState([]);

  useEffect(() => {
    if (overview?.img) {
      overview.img.forEach(i => {
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
    dispatch(editOverview(overview, { description: formValue }));
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
    return { __html: overview?.description };
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
    if (overview?.accounts && Object.keys(overview?.accounts)) {
      return Object.keys(overview?.accounts).map((key, i) => {
        const account = overview.accounts[key];
        return (
          <h4 key={i}>
            {account.account}: Gross: {account.gross} Net {account.net}
          </h4>
        );
      });
    }
  };

  const renderTradesCard = () =>
    tradesReview.map(trade => <TradeCard key={trade.id} trade={trade} />);

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
          defaultValue={overview?.description}
        />
      </div>
    );
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
        <h4>Description</h4>
        <div dangerouslySetInnerHTML={createMarkup()} />
        {renderPnLbyAccount()}
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
