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
          {Object.keys(overview.accounts).map(k => {
            return (
              <div key={k}>
                <div>{k}:</div>
                <div>R: {overview.accounts[k].r}</div>
                <div>P&L:{overview.accounts[k].net}</div>
              </div>
            );
          })}
        </div>
      </Link>
    );
  };

  const renderOverviews = () => {
    // const overviewsByWeek = [[], [], [], []];
    // let weekIndex = 0;
    // const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    // let currentWeek = [];

    // if (Object.keys(overviews)?.length) {
    //   Object.keys(overviews).forEach((o, i) => {
    //     if (i < Object.keys(overviews).length) {
    //       const currentDay = new Date(o).toDateString().substring(0, 3);
    //       const next = Object.keys(overviews)[i + 1];
    //       const nextDay = new Date(next).toDateString().substring(0, 3);
    //       const currentDayIndex = weekDays.indexOf(currentDay);
    //       const nextDayIndex = weekDays.indexOf(nextDay);

    //       console.log(currentDay);
    //       console.log(currentDayIndex);
    //       console.log(nextDay);
    //       console.log(nextDayIndex);

    //       if (nextDayIndex < currentDayIndex) {
    //         // New Week
    //         overviewsByWeek.splice(weekIndex, 0, currentWeek);
    //         weekIndex += 1;
    //         currentWeek = [];
    //       } else {
    //         currentWeek.push(renderDay(overviews[o]));
    //       }
    //     }
    //     // TODO:
    //     // Need to push last day into week (i < overviews.length)
    //     // There will be one remaining day
    //   });
    // }

    // console.log(overviewsByWeek);

    // return overviewsByWeek.length ? (
    //   overviewsByWeek
    // ) : (
    //   <div>No Overviews found for this period</div>
    // );

    if (Object.keys(overviews)?.length) {
      return Object.keys(overviews).map(o => {
        return renderDay(overviews[o]);
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
