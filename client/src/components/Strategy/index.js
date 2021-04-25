import { loadStrategy } from 'actions/strategy';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Button, Form, Select, SelectItem } from 'carbon-components-react';
import { Checkmark16 } from '@carbon/icons-react';
import { strategies } from '../../utils';

import styles from './strategy.module.css';

const Strategy = () => {
  const dispatch = useDispatch();
  const account = 'U3470252';
  useEffect(() => {
    const strategy = 'range';
    dispatch(loadStrategy(strategy, account));
  }, []);

  const data = useSelector(state => state.strategyReducer);
  console.log(data.sets);

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = e => {
    e.persist();
    dispatch(loadStrategy(e.target.value));
  };

  if (data.loading) {
    return 'Loading ...';
  } else {
    return (
      <>
        <Form>
          <Select
            ref={register}
            id="strategy"
            name="strategy"
            labelText="Strategy"
            defaultValue={'range'}
            invalidText="A valid value is required"
            onChange={onSubmit}
          >
            {strategies.map(s => {
              return <SelectItem text={s.label} value={s.id} key={s.id} />;
            })}
          </Select>
        </Form>
        <div>Strategy</div>
      </>
    );
  }
};

export default Strategy;
