import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { loadStrategy } from 'actions/strategy';
import { Button, Loading, Select, SelectItem } from 'carbon-components-react';
import { Checkmark16 } from '@carbon/icons-react';
import { Rstats, Sets } from 'components/Common';
import { accounts, strategies } from '../../utils';

import styles from './strategy.module.css';

const Strategy = () => {
  const dispatch = useDispatch();

  const data = useSelector(state => state.strategyReducer);

  const { register, handleSubmit, reset } = useForm();

  const [account, setAccount] = useState(accounts[0].id);
  const [strategy, setStrategy] = useState('range');

  useEffect(() => {
    dispatch(loadStrategy(strategy, account));
  }, []);

  const onSubmitStrategy = e => {
    e.persist();
    setStrategy(e.target.value);
    dispatch(loadStrategy(e.target.value, account));
  };

  const onSubmitAccount = e => {
    e.persist();
    setAccount(e.target.value);
    dispatch(loadStrategy(strategy, e.target.value));
  };

  const renderAccountSelect = () => {
    return (
      <div className={styles.dropdown}>
        <Select
          ref={register}
          id="account"
          name="account"
          invalidText="This is an invalid error message."
          labelText="Account"
          defaultValue={account}
          onChange={onSubmitAccount}
        >
          {accounts.map(s => (
            <SelectItem text={s.label} value={s.id} key={s.id} />
          ))}
        </Select>
      </div>
    );
  };

  const renderStrategySelect = () => {
    return (
      <div className={styles.dropdown}>
        <Select
          ref={register}
          id="strategy"
          name="strategy"
          labelText="Strategy"
          defaultValue={strategy}
          invalidText="A valid value is required"
          onChange={onSubmitStrategy}
        >
          {strategies.map(s => {
            return <SelectItem text={s.label} value={s.id} key={s.id} />;
          })}
        </Select>
      </div>
    );
  };

  if (data.loading) {
    return <Loading active small={false} withOverlay={true} />;
  } else {
    return (
      <div className={styles.strategyContainer}>
        <div className={styles.dropdowns}>
          {renderStrategySelect()}
          {renderAccountSelect()}
        </div>
        <Rstats account={account} data={data} />
        <Sets sets={data.sets[strategy]} />
      </div>
    );
  }
};

export default Strategy;
