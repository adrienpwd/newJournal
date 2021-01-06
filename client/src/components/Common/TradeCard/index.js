import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { useDrag } from 'react-dnd';
import { strategies } from './../../../utils';
import {
  ArrowDownRight32,
  ArrowUpRight32,
  WarningAlt16
} from '@carbon/icons-react';

import styles from './tradeCard.module.css';

export default function TradeCard({ unlinked, trade, url, seed }) {
  const match = useRouteMatch();

  const getTradeType = type =>
    type === 'B' ? <ArrowUpRight32 /> : <ArrowDownRight32 />;

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

  const [{ isDragging }, drag] = useDrag({
    item: { name: trade?.id, type: 'Box' },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        // TODO:
        // Fire edit seed action and link this trade to this seed
        // Need to verify that trade isn't already linked !!!
        alert(`You dropped ${item.name} into ${dropResult.name}!`);
      }
    },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });

  const opacity = isDragging ? 0.4 : 1;

  return (
    <div ref={drag} style={{ opacity }}>
      <div title={trade.ticker} className={styles.container}>
        <div className={styles.card}>
          <Link to={`/review/${match.params.day}/${trade.id}`}>
            <h2 className={styles.tradeHeader}>
              {trade.ticker} {displayWarning && <WarningAlt16 />}
              <div className={styles.element}>{getTradeType(trade.type)}</div>
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
