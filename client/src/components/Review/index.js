import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TradeCard } from 'components/Common';
import SeedCard from '../SeedCard';
import { Carousel } from 'react-responsive-carousel';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import {
  Button,
  Form,
  FileUploaderButton,
  Loading
} from 'carbon-components-react';
import { Link, useRouteMatch } from 'react-router-dom';
import {
  Edit16,
  Checkmark16,
  Close16,
  Sprout16,
  TrashCan16
} from '@carbon/icons-react';
import ReactQuill from 'react-quill';

import 'react-quill/dist/quill.snow.css';

import { loadTrades, uploadImages, deleteImage } from 'actions/trades';
import { editOverview, loadOverviews } from 'actions/overviews';
import { loadSeeds } from 'actions/seeds';

import styles from './review.module.css';

export default function Review() {
  const match = useRouteMatch();
  const history = useHistory();
  const dispatch = useDispatch();

  const tradeReducer = useSelector(state => state.tradeReducer);
  const overviewReducer = useSelector(state => state.overviewReducer);
  const seedReducer = useSelector(state => state.seedReducer);

  const { day } = useParams();

  const { trades } = tradeReducer;
  const tradesReview = trades?.[day];

  const { overviews } = overviewReducer;

  const { seeds } = seedReducer;
  const overviewSeeds = seeds[day];

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

  useEffect(() => {
    if (!overviewSeeds) {
      dispatch(loadSeeds(dayStartUnixTime, dayEndUnixTime));
    }
  }, []);

  const isOverviewLoading = overviewState?.loading;
  const isOverviewLoaded = overviewState?.loaded;

  const isSeedLoading = seedReducer?.loading;
  const isSeedLoaded = seedReducer?.loaded;

  const [isEditMode, setEditMode] = useState(false);

  const { register, handleSubmit } = useForm();

  const [images, setImages] = useState([]);

  const [isSeedEditMode, setSeedEditMode] = useState(false);

  useEffect(() => {
    if (overviewState?.img) {
      overviewState.img.forEach(i => {
        const imgArr = i.split('-');
        const path = `${imgArr[2]}/${imgArr[0]}/${imgArr[1]}`;
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
  }, [overviewState]);

  function makeEditState() {
    setEditMode(true);
  }

  function makeViewState() {
    setEditMode(false);
  }

  const makeSeedEditState = () => {
    setSeedEditMode(true);
  };

  const makeSeedViewState = () => {
    setSeedEditMode(false);
  };

  const handleCreateSeed = () => {
    history.push(`/review/${match.params.day}/create-new-seed`);
  };

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

  const handleDeleteScreenshot = img => {
    dispatch(deleteImage('overview', overviewState.id, img));
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

  const renderCards = () => {
    const linkedTradeIds = [];
    const linkedTrades = (overviewSeeds || []).map(seed => {
      const myTrades = (seed?.linked_trades || []).map((t, i) => {
        const trade = tradesReview?.find(trade => trade.id === t);
        linkedTradeIds.push(trade.id);
        return (
          <TradeCard trade={trade} seed={seed} key={`${trade.id}-${seed.id}`} />
        );
      });
      return (
        <div className={styles.seedAndTrades} key={`${seed.id}-linked`}>
          <SeedCard seed={seed} />
          {myTrades}
        </div>
      );
    });

    let unlinkedTrades = [];
    if (tradesReview) {
      unlinkedTrades = tradesReview
        .filter(t => {
          return !linkedTradeIds.includes(t.id);
        })
        .map((trade, i) => {
          return (
            <div className={styles.seedAndTrades} key={`${trade.id}-unlinked`}>
              <SeedCard unlinked seed={{}} />
              <TradeCard trade={trade} unlinked />
            </div>
          );
        });
    }

    // When there is no unlinked trades there is no way to unlink
    // linked trade, so we push a Unlink seedcard
    if (unlinkedTrades.length === 0) {
      unlinkedTrades.push(
        <div key="unlink" className={styles.seedAndTrades}>
          <SeedCard unlinked seed={{}} />
        </div>
      );
    }

    return [linkedTrades, unlinkedTrades];
  };

  const renderImgList = () => {
    return overviewState?.img?.map(img => {
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
        <div>
          <ReactQuill
            theme="snow"
            value={formValue}
            onChange={setFormValue}
            defaultValue={overviewState?.description}
          />
        </div>
        <div>
          <span>Screenshots:</span>
          {renderImgList()}
        </div>
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
          <Button
            className={styles.createSeed}
            kind="primary"
            size="small"
            onClick={handleCreateSeed}
            hasIconOnly
            renderIcon={Sprout16}
            iconDescription="Plant Seed"
            tooltipPosition="bottom"
          />
        </h4>
        <h4>Description</h4>
        <div dangerouslySetInnerHTML={createMarkup()} />
        {renderPnLbyAccount()}
        <DndProvider backend={HTML5Backend}>
          <div className={styles.cardsContainer}>{renderCards()}</div>
        </DndProvider>
        <div>{renderImages()}</div>
      </div>
    );
  }

  return isOverviewLoading && !isOverviewLoaded ? (
    <Loading active small={false} withOverlay={true} />
  ) : (
    <div className={styles.reviewContainer}>{display}</div>
  );
}
