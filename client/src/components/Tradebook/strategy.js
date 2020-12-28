import React, { useState } from 'react';
import Strategies from './strategies';
import { getStrategie } from '../../utils';
import { Checkbox } from 'carbon-components-react';

import styles from './strategies.module.css';

export default function Strategy(props) {
  const { strategyId } = props;
  const myStrategy = getStrategie(strategyId);

  const renderStrategyItem = item => {
    return Object.keys(item).map(itemKey => (
      <div key={`${myStrategy.id}-${itemKey}`} className={styles.rule}>
        <Checkbox
          // ref={register}
          labelText={item[itemKey]}
          id={itemKey}
          name={itemKey}
          key={itemKey}
        />
      </div>
    ));
  };

  return myStrategy ? (
    <div className={styles.strategieContainer}>
      <h4>{myStrategy.label}</h4>
      <p>{myStrategy.description}</p>
      <br />
      <h4>Indicators</h4>
      {renderStrategyItem(myStrategy.indicators)}
      <br />
      <h4>Confirmations</h4>
      {renderStrategyItem(myStrategy.confirmations)}
      <br />
      <h4>Stop Loss</h4>
      {renderStrategyItem(myStrategy.stopLoss)}
      <br />
      <h4>Target</h4>
      {renderStrategyItem(myStrategy.target)}
      <br />
      <h4>Adds</h4>
      {renderStrategyItem(myStrategy.adds)}
      <br />
      <h4>Rules</h4>
      {renderStrategyItem(myStrategy.rules)}
      <br />
    </div>
  ) : (
    <span>No strategy</span>
  );
}
