import { loadSets } from 'actions/sets';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Button, Form, Select, SelectItem } from 'carbon-components-react';
import { Checkmark16 } from '@carbon/icons-react';
import { strategies } from './../../utils';

import styles from './sets.module.css';

const Sets = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const strategy = 'range';
    dispatch(loadSets(strategy));
  }, []);

  const data = useSelector(state => state.setReducer);
  console.log(data.sets);

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = e => {
    e.persist();
    dispatch(loadSets(e.target.value));
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
        <div>Sets</div>
      </>
    );
  }
};

export default Sets;
