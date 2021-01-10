import React, { useState, useEffect } from 'react';
import { strategies } from '../../utils';
import { useDrop } from 'react-dnd';
import { Link, useRouteMatch } from 'react-router-dom';
import { CaretDown32, CaretUp32, WarningAlt32 } from '@carbon/icons-react';

import styles from './seedCard.module.css';

export default props => {
  const { seed, unlinked } = props;
  const match = useRouteMatch();

  const getTradeType = isLong => (isLong ? <CaretUp32 /> : <CaretDown32 />);

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

  const renderSeedCard = () => {
    if (unlinked) {
      return (
        <div className={styles.containerUnlinked}>
          <WarningAlt32 className={styles.unlinkedIcon} />
          <span>Unlinked</span>
        </div>
      );
    } else {
      const arrowClass = seed.isLong ? styles.arrowLong : styles.arrowShort;
      return (
        <div>
          <Link to={`/review/${match.params.day}/${seed.id}`}>
            <h2 className={styles.seedHeader}>
              {seed.ticker}
              <div className={styles.element}>
                <span className={arrowClass}>{getTradeType(seed.isLong)}</span>
              </div>
            </h2>
          </Link>
          <div>Time: {seed.time}</div>
          <div className={styles.element}>{renderStrategy()}</div>
          <div>Price: {`$${seed.price}`}</div>
        </div>
      );
    }
  };

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: 'Box',
    drop: () => ({ name: seed?.id || 'unlink' }),
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });
  const isActive = canDrop && isOver;
  const borderColor = unlinked ? '#d7ccc8' : '#a1887f';
  let backgroundColor = '#f5f5f6';
  if (isActive) {
    backgroundColor = '#dcdcdd';
  }

  return (
    <div
      ref={drop}
      style={{ backgroundColor, borderColor }}
      className={styles.container}
    >
      <div className={styles.card}>{renderSeedCard()}</div>
    </div>
  );
};
