import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { useDrag } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { strategies } from './../../../utils';
import { editTradeLink } from 'actions/seeds';
import { CaretDown32, CaretUp32, WarningAlt16 } from '@carbon/icons-react';

import styles from './tradeCard.module.css';

export default function TradeCard({ unlinked, trade, url, seed }) {
  const match = useRouteMatch();
  const dispatch = useDispatch();

  const getTradeType = type => (type === 'B' ? <CaretUp32 /> : <CaretDown32 />);

  let gainClass;
  if (trade?.r >= 1) {
    gainClass = styles.positive;
  } else if (trade?.r <= 1 && trade?.r >= -1) {
    gainClass = styles.neuter;
  } else {
    gainClass = styles.negative;
  }

  const myStrategyId = seed?.strategy || trade?.strategy;
  const strategy = strategies.find(s => myStrategyId === s.id);

  const renderStrategy = () => {
    const strategyClass = strategy?.label ? null : styles.strategyMissing;
    return (
      <div className={strategyClass}>
        {strategy?.label || 'Strategy Missing'}
      </div>
    );
  };

  // Display a warning sign if the trade is missing the commissions
  // We display the gross gain if it's missing commissions, or the net gain
  // if we have it.
  const displayWarning = !trade?.net_gain || isNaN(trade?.net_gain);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'Box',
    item: { id: trade?.id },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        const currentSeedId = seed?.id || '';
        dispatch(editTradeLink(currentSeedId, dropResult.name, item.id));
      }
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging()
    })
  }));

  const opacity = isDragging ? 0.4 : 1;

  const arrowClass = trade.type === 'B' ? styles.arrowLong : styles.arrowShort;

  return (
    <div ref={drag} style={{ opacity }} key={trade.id}>
      <div title={trade.ticker} className={styles.container}>
        <div className={styles.card}>
          <Link to={`/review/${match.params.day}/${trade.id}`}>
            <h2 className={styles.tradeHeader}>
              {trade.ticker} {displayWarning && <WarningAlt16 />}
              <div className={styles.element}>
                <span className={arrowClass}>{getTradeType(trade.type)}</span>
              </div>
            </h2>
          </Link>
          <div className={styles.element}>{trade.time}</div>
          <div className={styles.element}>{trade.account}</div>
          <div className={styles.element}>{renderStrategy()}</div>
          <div className={styles.element + ' ' + gainClass}>
            {displayWarning ? `$${trade.gross_gain}` : `$${trade.net_gain}`}
          </div>
        </div>
      </div>
    </div>
  );
}
