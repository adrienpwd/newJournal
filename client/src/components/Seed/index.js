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
import { strategies } from './../../utils';
import { editSeed } from 'actions/seeds';

import { Checkmark16, Edit16, Close16 } from '@carbon/icons-react';

import styles from './seed.module.css';

export default function Seed(props) {
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
    const { stock, strategy } = data;
    // TODO:
    // Maybe there is a better id for a Seed
    // Should I keep the same seed if the trade is a bit different fromt when I created the seed ???
    // Example: I create a seed the morning for AAPl, but I don't enter because I can't find a ggod entry.
    // Then in the afternoon I find a good entry, at a different price.
    // It should be a new seed, but the id might be the same if the strategy is the same.
    // Use uuid() ?
    const seedData = {
      id: `${overviewId}-${stock}-${strategy}`,
      isLong: tradeLong,
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
            id="stock"
            name="stock"
            invalidText="A valid value is required"
            labelText="Stock"
            placeholder="Enter Stock name"
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
        className={styles.submitButton}
        kind="primary"
        size="small"
        onClick={makeEditState}
        tooltipPosition="bottom"
        renderIcon={Edit16}
      >
        Create Seed
      </Button>
    );
  }
}
