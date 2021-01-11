import React from 'react';
import Strategies from './strategies';
import { getStrategie, rulesItems } from '../../utils';
import { Checkbox, Form, FormGroup } from 'carbon-components-react';

import { Checkmark16, Close16 } from '@carbon/icons-react';

import styles from './strategies.module.css';

export default function Strategy(props) {
  const {
    type,
    isEditMode,
    strategyId,
    register,
    seedRulesRespected,
    tradeRulesRespected
  } = props;
  const myStrategy = getStrategie(strategyId);

  console.log(tradeRulesRespected);

  const renderStrategyItem = item => {
    return Object.keys(myStrategy?.[item]).map((itemKey, i) => {
      const rule = `${item}-${i}`;
      const isChecked =
        tradeRulesRespected?.[rule] ?? seedRulesRespected?.[rule];
      return (
        <div key={`${myStrategy.id}-${itemKey}`} className={styles.rule}>
          <Checkbox
            ref={register}
            labelText={myStrategy[item][itemKey]}
            id={`${item}-${i}`}
            name={`${item}-${i}`}
            key={`${item}-${i}`}
            defaultChecked={isChecked}
          />
        </div>
      );
    });
  };

  const renderFormGroup = r => {
    const legendText = r.charAt(0).toUpperCase() + r.substring(1);
    return (
      <FormGroup key={r} legendText={legendText}>
        {renderStrategyItem(r)}
      </FormGroup>
    );
  };

  let renderRules;
  if (type === 'trade') {
    renderRules = rulesItems;
  } else {
    renderRules = ['indicators', 'confirmations', 'rules'];
  }

  return strategyId ? (
    <div className={styles.strategieContainer}>
      <h4>{myStrategy.label}</h4>
      <p>{myStrategy.description}</p>
      <br />
      <Form>{renderRules.map(r => renderFormGroup(r))}</Form>
      <br />
    </div>
  ) : (
    <span>No strategy</span>
  );
}
