import React, { useEffect, useState } from 'react';
import { loadOverviews } from 'actions/overviews';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Button,
  DatePicker,
  DatePickerInput,
  Loading
} from 'carbon-components-react';
import { getDayOfWeek, getMonth } from '../../utils';

import styles from './overviews.module.css';

export default function Overviews() {
  const dispatch = useDispatch();

  const today = new Date();
  const twoWeeks = 1209600000;
  const end = today.getTime();
  const start = end - twoWeeks;

  const endUnixTime = Math.floor(end / 1000);
  const startUnixTime = Math.floor(start / 1000);

  const [dateRange, setDateRange] = useState({
    start,
    end
  });

  useEffect(() => {
    dispatch(loadOverviews(startUnixTime, endUnixTime));
  }, []);

  const data = useSelector(state => state.overviewReducer);
  const { loaded, loading, overviews } = data;

  const handleDateChange = range => {
    const [start, end] = range;
    setDateRange({
      start: start?.getTime(),
      end: end?.getTime()
    });
  };

  const handleSubmitDateRange = () => {
    const endUnixTime = Math.floor(dateRange.end / 1000);
    const startUnixTime = Math.floor(dateRange.start / 1000);
    dispatch(loadOverviews(startUnixTime, endUnixTime));
  };

  const renderDatePicker = () => {
    return (
      <DatePicker
        id="date-picker"
        dateFormat="m/d/Y"
        datePickerType="range"
        light={false}
        locale="en"
        onChange={handleDateChange}
        onClose={function noRefCheck() {}}
        short={false}
      >
        <DatePickerInput
          disabled={false}
          iconDescription="Starting date"
          id="date-picker-input-id-start"
          invalid={false}
          invalidText="A valid value is required"
          labelText="Starting date"
          onChange={function noRefCheck() {}}
          onClick={function noRefCheck() {}}
          pattern="d{1,2}/d{4}"
          placeholder="mm/dd/yyyy"
          size={undefined}
          type="text"
        />
        <DatePickerInput
          disabled={false}
          iconDescription="Ending date"
          id="date-picker-input-id-end"
          invalid={false}
          invalidText="A valid value is required"
          labelText="Ending Date"
          onChange={function noRefCheck() {}}
          onClick={function noRefCheck() {}}
          pattern="d{1,2}/d{4}"
          placeholder="mm/dd/yyyy"
          size={undefined}
          type="text"
        />
      </DatePicker>
    );
  };

  const renderDay = function (dayString) {
    console.log(dayString);
    const dayArr = dayString.split('-');
    const year = dayArr[2];
    const month = dayArr[0] - 1;
    const day = dayArr[1];
    const date = new Date(year, month, day);
    const dayOfWeekIndex = date.getDay();
    const monthIndex = date.getMonth();

    const dateString = `${getDayOfWeek(dayOfWeekIndex)} ${Number(
      day
    )} ${getMonth(monthIndex)} ${date.getFullYear()}`;

    return (
      <Link key={day} to={`review/${dayString}`} className={styles.tradeLink}>
        {dateString}
      </Link>
    );
  };

  const renderOverviews = () => {
    if (Object.keys(overviews)?.length) {
      return Object.keys(overviews).map(o => {
        return <div key={o}>{renderDay(overviews[o].id)}</div>;
      });
    } else {
      return <div>No Overviews found for this period</div>;
    }
  };

  const startingDate = new Date(dateRange.start);
  const endingDate = new Date(dateRange.end);

  const renderBody = () => {
    if (loading) {
      return <Loading description="Loading overviews" withOverlay={false} />;
    } else {
      return (
        <div className={styles.overviewsContainer}>
          <h4>Overviews:</h4>
          <div>
            {startingDate.toDateString()} to {endingDate.toDateString()}
          </div>
          <div className={styles.overviewsList}>{renderOverviews()}</div>
        </div>
      );
    }
  };

  return (
    <>
      <div className={styles.calendarContainer}>
        {renderDatePicker()}
        <Button
          className={styles.submitButton}
          kind="primary"
          size="small"
          onClick={handleSubmitDateRange}
          tooltipPosition="bottom"
        >
          Submit
        </Button>
      </div>
      {renderBody()}
    </>
  );
}
