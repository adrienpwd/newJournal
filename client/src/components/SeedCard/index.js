import React, { useState, useEffect } from 'react';
import { strategies } from '../../utils';
import { Link, useRouteMatch } from 'react-router-dom';
import {
  ArrowDownRight32,
  ArrowUpRight32,
  WarningAlt32
} from '@carbon/icons-react';

import styles from './seedCard.module.css';

export default props => {
  const { seed, unlinked } = props;
  const match = useRouteMatch();

  const getTradeType = isLong =>
    isLong ? <ArrowUpRight32 /> : <ArrowDownRight32 />;

  const renderStrategy = () => {
    const strategy = strategies.find(s => seed.strategy === s.id);

    const strategyClass = strategy?.label ? null : styles.strategyMissing;
    return (
      <div className={strategyClass}>
        Strategie: {strategy?.label || 'Strategy Missing'}
      </div>
    );
  };

  function createMarkup() {
    return { __html: seed?.description };
  }

  if (unlinked) {
    return (
      <div className={styles.containerUnlinked}>
        <WarningAlt32 className={styles.unlinkedIcon} />
        Unlinked
      </div>
    );
  }

  return (
    <Link to={`/review/${match.params.day}/${seed.id}`}>
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.tradeHeader}>
            {seed.ticker}
            <div className={styles.element}>{getTradeType(seed.isLong)}</div>
          </h2>
          <div>Time: {seed.time}</div>
          <div className={styles.element}>{renderStrategy()}</div>
          <div>Price: {`$${seed.price}`}</div>
        </div>
      </div>
    </Link>
  );
};
