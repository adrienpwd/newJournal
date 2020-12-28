import React from 'react';
import Strategies from './strategies';
import { getStrategie } from '../../utils';
import { Checkbox, Form, FormGroup } from 'carbon-components-react';

import styles from './strategies.module.css';

export default function Strategy(props) {
  const { isEditMode, strategyId, register, trade } = props;
  const myStrategy = getStrategie(strategyId);

  const renderStrategyItem = item => {
    return Object.keys(myStrategy?.[item]).map((itemKey, i) => {
      return (
        <div key={`${myStrategy.id}-${itemKey}`} className={styles.rule}>
          <Checkbox
            ref={register}
            labelText={myStrategy[item][itemKey]}
            id={`${item}-${i}`}
            name={`${item}-${i}`}
            key={`${item}-${i}`}
            defaultChecked={trade[`${item}-${i}`]}
            disabled={!isEditMode}
          />
        </div>
      );
    });
  };

  return myStrategy ? (
    <div className={styles.strategieContainer}>
      <h4>{myStrategy.label}</h4>
      <p>{myStrategy.description}</p>
      <br />
      <Form>
        <FormGroup legendText="">
          <h4>Indicators</h4>
          {renderStrategyItem('indicators')}
          <br />
          <h4>Confirmations</h4>
          {renderStrategyItem('confirmations')}
          <br />
          <h4>Stop Loss</h4>
          {renderStrategyItem('stopLoss')}
          <br />
          <h4>Target</h4>
          {renderStrategyItem('targets')}
          <br />
          <h4>Adds</h4>
          {renderStrategyItem('adds')}
          <br />
          <h4>Rules</h4>
          {renderStrategyItem('rules')}
        </FormGroup>
      </Form>
      <br />
    </div>
  ) : (
    <span>No strategy</span>
  );
}
