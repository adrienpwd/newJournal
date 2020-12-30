import React from 'react';
import Strategies from './strategies';
import { getStrategie } from '../../utils';
import { Checkbox, Form, FormGroup } from 'carbon-components-react';

import { Checkmark16, Close16 } from '@carbon/icons-react';

import styles from './strategies.module.css';

export default function Strategy(props) {
  const { isEditMode, strategyId, register, trade } = props;
  const myStrategy = getStrategie(strategyId);

  const renderStrategyItem = item => {
    return Object.keys(myStrategy?.[item]).map((itemKey, i) => {
      const isChecked = trade?.rulesRespected.includes(`${item}-${i}`);
      return (
        <div key={`${myStrategy.id}-${itemKey}`} className={styles.rule}>
          <Checkbox
            ref={register}
            labelText={myStrategy[item][itemKey]}
            id={`${item}-${i}`}
            name={`${item}-${i}`}
            key={`${item}-${i}`}
            defaultChecked={isChecked}
            disabled={!isEditMode && trade}
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
          <FormGroup legendText="Indicators">
            {renderStrategyItem('indicators')}
          </FormGroup>
          <FormGroup legendText="Confirmations">
            {renderStrategyItem('confirmations')}
          </FormGroup>
          <FormGroup legendText="Stop Loss">
            {renderStrategyItem('stopLoss')}
          </FormGroup>
          <FormGroup legendText="Targets">
            {renderStrategyItem('targets')}
          </FormGroup>
          <FormGroup legendText="Adds">{renderStrategyItem('adds')}</FormGroup>
          <FormGroup legendText="Rules">
            {renderStrategyItem('rules')}
          </FormGroup>
        </FormGroup>
      </Form>
      <br />
    </div>
  ) : (
    <span>No strategy</span>
  );
}
