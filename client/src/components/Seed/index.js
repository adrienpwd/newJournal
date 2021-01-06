import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadSeeds } from 'actions/seeds';
import { Loading } from 'carbon-components-react';
import { strategies } from '../../utils';

import styles from './seed.module.css';

export default props => {
  const { tradeId, day } = useParams();

  const seedReducer = useSelector(state => state.seedReducer);
  const { seeds, isLoading, isLoaded } = seedReducer;
  const overviewSeeds = seeds[day];

  const dispatch = useDispatch();
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
    if (!overviewSeeds) {
      dispatch(loadSeeds(dayStartUnixTime, dayEndUnixTime));
    }
  }, []);

  const seed = overviewSeeds?.length
    ? overviewSeeds.find(s => s.id === tradeId)
    : {};

  const strategy = strategies.find(s => seed.strategy === s.id);

  function createMarkup() {
    return { __html: seed?.description };
  }

  const renderStrategy = () => {
    const strategyClass = strategy?.label ? null : styles.strategyMissing;
    return (
      <div className={strategyClass}>
        Strategie: {strategy?.label || 'Strategy Missing'}
      </div>
    );
  };

  const getTradeType = isLong => (isLong ? 'Long' : 'Short');

  const renderSeed = () => {
    return (
      <div className={styles.container}>
        <h2 className={styles.tradeHeader}>{seed.ticker}</h2>
        <div className={styles.element}>Side: {getTradeType(seed.isLong)}</div>
        <div>Time: {seed.time}</div>
        <div className={styles.element}>{renderStrategy()}</div>
        <div>Price: {`$${seed.price}`}</div>
        <div dangerouslySetInnerHTML={createMarkup()} />
      </div>
    );
  };

  return isLoading && !isLoaded ? (
    <Loading active small={false} withOverlay={true} />
  ) : (
    <div className={styles.reviewContainer}>{renderSeed()}</div>
  );
};
