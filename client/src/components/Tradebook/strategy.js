import React from 'react';
import { getStrategie, rulesItems } from '../../utils';
import { Checkbox, Form, FormGroup } from 'carbon-components-react';

import styles from './strategies.module.css';

export default function Strategy(props) {
  const {
    type,
    strategyId,
    register,
    seedRulesRespected,
    tradeRulesRespected
  } = props;

  const myStrategy = getStrategie(strategyId);

  const renderStrategyItem = item => {
    return Object.keys(myStrategy?.[item]).map((itemKey, i) => {
      const rule = `${item}-${itemKey}`;
      const isChecked =
        tradeRulesRespected?.[rule] ?? seedRulesRespected?.[rule];
      const name = `${item}-${myStrategy[item][itemKey].id}`;
      const registerProp = typeof register === 'function' ?
        {...register(name)}:
        {};
      return (
        <div key={`${myStrategy.id}-${itemKey}`} className={styles.rule}>
          <Checkbox
            labelText={myStrategy[item][itemKey].description}
            id={name}
            name={name}
            key={name}
            defaultChecked={isChecked}
            register={registerProp}
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
    renderRules = ['requirements'];
  }

  return strategyId ? (
    <div className={styles.strategieContainer}>
      <h4>{myStrategy?.label}</h4>
      <p>{myStrategy?.description}</p>
      <br />
      <Form>{renderRules.map(r => renderFormGroup(r))}</Form>
      <br />
    </div>
  ) : (
    <span>No strategy</span>
  );
}
