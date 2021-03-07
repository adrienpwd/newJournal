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
import { accounts, getMonth } from '../../utils';

import styles from './overviews.module.css';

export default function Overviews() {
  const dispatch = useDispatch();

  const today = new Date();
  const oneMonth = 2419200000;
  const end = today.getTime();
  const start = end - oneMonth;

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
          labelText="Starting Date"
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

  const renderDay = function (overview) {
    const dayString = overview.id;
    const dayArr = dayString.split('-');
    const year = dayArr[2];
    const month = dayArr[0] - 1;
    const day = dayArr[1];
    const date = new Date(year, month, day);
    const dayOfWeekIndex = date.getDay();
    const monthIndex = date.getMonth();

    // We only look at the Live account to assign a color, based on R
    const myLiveAccount = accounts[0].id;
    const mySimAccount = accounts[1].id;

    let overviewClass;
    const r =
      overview?.accounts?.[myLiveAccount]?.r ||
      overview?.accounts?.[mySimAccount]?.r;
    if (r >= 1) {
      overviewClass = styles.overviewGreen;
    } else if (r <= 1 && r >= -1) {
      overviewClass = styles.overviewNeuter;
    } else {
      overviewClass = styles.overviewRed;
    }

    return (
      <Link key={day} to={`review/${dayString}`}>
        <div className={styles.overview}>
          <div className={overviewClass}>{date.toDateString()}</div>
          {Object.keys(overview?.accounts || {}).map(k => {
            return (
              <div key={k} className={styles.account}>
                <div>{k}</div>
                <div>R: {overview.accounts[k].r}</div>
                <div>P&L: {overview.accounts[k].net}</div>
              </div>
            );
          })}
        </div>
      </Link>
    );
  };

  const getOverviewsByWeek = () => {
    const overviewsByWeek = [];
    let weekIndex = 0;
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    let currentWeek = [
      <div className={styles.overview} key={1} />,
      <div className={styles.overview} key={2} />,
      <div className={styles.overview} key={3} />,
      <div className={styles.overview} key={4} />,
      <div className={styles.overview} key={5} />
    ];

    const overviewKeys = Object.keys(overviews);

    if (overviewKeys?.length) {
      overviewKeys.forEach((o, i) => {
        if (i < overviewKeys.length - 1) {
          const currentYear = o.substring(6, 10);
          const currentMonth = o.substring(0, 2) - 1;
          const currentDay = o.substring(3, 5);

          const currentDate = new Date(currentYear, currentMonth, currentDay)
            .toDateString()
            .substring(0, 3);
          const next = overviewKeys[i + 1];
          const nextYear = next.substring(6, 10);
          const nextMonth = next.substring(0, 2) - 1;
          const nextDay = next.substring(3, 5);
          const nextDate = new Date(nextYear, nextMonth, nextDay)
            .toDateString()
            .substring(0, 3);
          const currentDayIndex = weekDays.indexOf(currentDate);
          const nextDayIndex = weekDays.indexOf(nextDate);

          if (nextDayIndex < currentDayIndex) {
            // New Week
            // currentWeek[currentDayIndex] = renderDay(overviews[o]);
            currentWeek.splice(currentDayIndex, 1, renderDay(overviews[o]));
            overviewsByWeek.push(currentWeek);
            currentWeek = [
              <div className={styles.overview} key={1} />,
              <div className={styles.overview} key={2} />,
              <div className={styles.overview} key={3} />,
              <div className={styles.overview} key={4} />,
              <div className={styles.overview} key={5} />
            ];
          } else {
            // currentWeek[currentDayIndex] = renderDay(overviews[o]);
            currentWeek.splice(currentDayIndex, 1, renderDay(overviews[o]));
          }
        }
      });

      // Need to push last day into week (i < overviews.length)
      // There will be one remaining day
      const lastOverviewIndex = overviewKeys.length - 1;
      const lastOverviewKey = overviewKeys[lastOverviewIndex];
      const lastOverviewDay = new Date(overviews[lastOverviewKey].id)
        .toDateString()
        .substring(0, 3);
      const lastOverviewDayIndex = weekDays.indexOf(lastOverviewDay);
      // currentWeek[lastOverviewDayIndex] = renderDay(overviews[lastOverviewKey]);
      currentWeek.splice(
        lastOverviewDayIndex,
        1,
        renderDay(overviews[lastOverviewKey])
      );

      // Push last week of the month
      overviewsByWeek.push(currentWeek);
    }

    return overviewsByWeek;
  };

  const renderOverviewsByWeek = overviews => {
    return <div className={styles.overviewsList}>{overviews}</div>;
  };

  const startingDate = new Date(dateRange.start);
  const endingDate = new Date(dateRange.end);

  const overviewsByWeek = getOverviewsByWeek();

  const renderBody = () => {
    if (overviewsByWeek.length === 0) {
      return (
        <div className={styles.noOverviewFound}>
          No Overviews found for this period
        </div>
      );
    }
    if (loading) {
      return <Loading description="Loading overviews" withOverlay={false} />;
    } else {
      return (
        <div className={styles.overviewsContainer}>
          <h4>Overviews:</h4>
          <div>
            {startingDate.toDateString()} to {endingDate.toDateString()}
          </div>
          {renderOverviewsByWeek(overviewsByWeek[0])}
          {renderOverviewsByWeek(overviewsByWeek[1])}
          {renderOverviewsByWeek(overviewsByWeek[2])}
          {renderOverviewsByWeek(overviewsByWeek[3])}
          {renderOverviewsByWeek(overviewsByWeek[4])}
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
