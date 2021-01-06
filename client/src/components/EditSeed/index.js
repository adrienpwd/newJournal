import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Button,
  Form,
  NumberInput,
  Select,
  SelectItem,
  TextInput,
  Toggle
} from 'carbon-components-react';
import { useForm } from 'react-hook-form';
import ReactQuill from 'react-quill';
import { strategies } from '../../utils';
import { editSeed } from 'actions/seeds';
import { v4 as uuidv4 } from 'uuid';

import { Checkmark16, Edit16, Close16 } from '@carbon/icons-react';

import styles from './editSeed.module.css';

export default function EditSeed(props) {
  const dispatch = useDispatch();

  const [isEditMode, setEditMode] = useState(false);
  const [tradeLong, setTradeLong] = useState(true);
  const [formValue, setFormValue] = useState('');

  const { overviewId } = props;

  const makeEditState = () => {
    setEditMode(true);
  };

  const makeViewState = () => {
    setEditMode(false);
  };

  const onSubmit = data => {
    const { ticker, strategy } = data;

    const currentTime = new Date();
    const seedHours = currentTime.getHours();
    const seedMinutes =
      String(currentTime.getMinutes()).length == 2
        ? currentTime.getMinutes()
        : `0${currentTime.getMinutes()}`;
    const seedDate = new Date(overviewId);
    const timestamp = (seedDate - (seedDate % 1000)) / 1000;

    const seedData = {
      id: `${overviewId}-${ticker}-${strategy}-${uuidv4()}`,
      time: `${seedHours}:${seedMinutes}`,
      isLong: tradeLong,
      timestamp,
      description: formValue,
      ...data
    };

    dispatch(editSeed({}, seedData));
    makeViewState();
  };

  const handleSideChange = e => {
    setTradeLong(e);
  };

  const { register, handleSubmit, reset } = useForm();

  // TODO:
  // Need to be able to Edit the Seeds that were already created
  // Need to be able to delete a Seed

  if (isEditMode) {
    return (
      <div>
        <div className={styles.headerContainer}>
          <h4>Seed</h4>
          <Button
            className={styles.editButton}
            kind="primary"
            size="small"
            onClick={handleSubmit(onSubmit)}
            hasIconOnly
            renderIcon={Checkmark16}
            iconDescription="Validate seed details"
            tooltipPosition="bottom"
          />
          <Button
            className={styles.editButton}
            kind="danger"
            size="small"
            onClick={makeViewState}
            hasIconOnly
            renderIcon={Close16}
            iconDescription="Cancel"
            tooltipPosition="bottom"
          />
        </div>
        <ReactQuill theme="snow" value={formValue} onChange={setFormValue} />
        <Form>
          <TextInput
            ref={register}
            id="ticker"
            name="ticker"
            invalidText="A valid value is required"
            labelText="Ticker"
            placeholder="Enter Ticker"
          />
          <Toggle
            ref={register}
            id="side"
            name="side"
            aria-label="trade side"
            defaultToggled
            id="side-toggle"
            labelText="Long"
            onToggle={handleSideChange}
          />
          <Select
            ref={register}
            id="strategy"
            name="strategy"
            labelText="Strategy"
            invalidText="A valid value is required"
          >
            {strategies.map(s => {
              return <SelectItem text={s.label} value={s.id} key={s.id} />;
            })}
          </Select>
          <NumberInput
            ref={register}
            id="price"
            name="price"
            invalidText="Number is not valid"
            label="Price"
            min={0}
            step={1}
          />
        </Form>
      </div>
    );
  } else {
    return (
      <Button
        className={styles.seedButton}
        kind="tertiary"
        size="small"
        onClick={makeEditState}
        tooltipPosition="bottom"
      >
        Plant Seed
      </Button>
    );
  }
}
