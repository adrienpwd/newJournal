import React, { useState, useEffect } from 'react';
import { getStats, setAccount } from './../../actions/dashboard';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Button, Loading, Select, SelectItem } from 'carbon-components-react';
import { CaretLeft16, CaretRight16 } from '@carbon/icons-react';
import { accounts, getMonth } from './../../utils';
import { Rstats } from 'components/Common';
import { useHistory } from 'react-router-dom';

import styles from './dashboard.module.css';

export default function DashboardAll(props) {
  const dispatch = useDispatch();
  const dashboardState = useSelector(state => state.dashboardReducer);
  const history = useHistory();

  const isLoading = dashboardState?.loading;
  const isLoaded = dashboardState?.loaded;
  const dailyPNL = dashboardState?.dailyPNL;
  const account = dashboardState?.account;

  const date = new Date();
  const [selectedYear, setSelectedYear] = useState(date.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(date.getMonth());
  const selectedMonthText = getMonth(selectedMonth);
  const firstDay = new Date(selectedYear, selectedMonth, 1);
  const lastDay = new Date(selectedYear, selectedMonth + 1, 0);
  // Add 24 hours minus 1sec to include the last day of the month
  const thisDayInSeconds = 86399;

  const firstDayUnixTime = Math.floor(firstDay / 1000);
  const lastDayUnixTime = Math.floor(lastDay / 1000 + thisDayInSeconds);

  function prevMonth() {
    setSelectedMonth(selectedMonth - 1);
  }

  function nextMonth() {
    setSelectedMonth(selectedMonth + 1);
  }

  useEffect(() => {
    dispatch(getStats(account, firstDayUnixTime, lastDayUnixTime));
  }, [account, firstDayUnixTime, lastDayUnixTime, selectedYear, selectedMonth]);

  const handleAccountChange = e => {
    dispatch(setAccount(e.target.value));
  };

  const handleYearChange = e => {
    setSelectedYear(e.target.value);
  };

  const renderAccountSelect = () => {
    return (
      <div className={styles.dropdown}>
        <Select
          onChange={handleAccountChange}
          id="account"
          name="account"
          invalidText="This is an invalid error message."
          labelText="Account"
          defaultValue={accounts[0].id}
          register="account"
        >
          {accounts.map(s => (
            <SelectItem text={s.label} value={s.id} key={s.id} />
          ))}
        </Select>
      </div>
    );
  };

  const renderYearSelect = () => {
    const years = [
      { id: '2020', label: '2020' },
      { id: '2021', label: '2021' }
    ];
    return (
      <div className={styles.dropdown}>
        <Select
          onChange={handleYearChange}
          id="year"
          name="year"
          invalidText="This is an invalid error message."
          labelText="Year"
          defaultValue={selectedYear}
        >
          {years.map(s => (
            <SelectItem text={s.label} value={s.id} key={s.id} />
          ))}
        </Select>
      </div>
    );
  };

  const renderRstats = () => {
    return <Rstats account={account} data={dashboardState} />;
  };

  const handlePnLClick = (point, event) => {
    const day = point.data.xFormatted;
    history.push(`/review/${day}`);
  };

  const getMonthlyRs = () => {
    let total = 0;
    dailyPNL[1].forEach(pnl => {
      total += pnl.y;
    });

    return Math.round(total * 10) / 10;
  };

//   const renderDailyR = () => {
//     const data = [
//       {
//         id: 'r',
//         data: dailyPNL[1]
//       }
//     ];

//     return (
//       <Line
//         colors={{ scheme: 'category10' }}
//         onClick={handlePnLClick}
//         width={900}
//         height={250}
//         margin={{ top: 20, right: 40, bottom: 20, left: 40 }}
//         data={data}
//         animate={true}
//         enableSlices={false}
//         useMesh={true}
//         xScale={{ type: 'point' }}
//         yScale={{
//           type: 'linear',
//           stacked: false,
//           min: 'auto',
//           max: 'auto'
//         }}
//         axisLeft={{
//           tickPadding: 20,
//           legend: '',
//           legendOffset: 0
//         }}
//         axisBottom={{
//           orient: 'bottom'
//         }}
//         curve="monotoneX"
//         enablePointLabel={true}
//         pointSize={6}
//         pointBorderWidth={1}
//         pointBorderColor={{
//           from: 'color',
//           modifiers: [['darker', 0.3]]
//         }}
//         enableGridX={false}
//         enableGridY
//       />
//     );
//   };

//   const renderMonthlyPnL = () => {
//     const data = [
//       {
//         id: 'r',
//         data: dailyPNL[0]
//       }
//     ];

//     return (
//       <Line
//         colors={{ scheme: 'category10' }}
//         onClick={handlePnLClick}
//         width={900}
//         height={250}
//         margin={{ top: 20, right: 40, bottom: 20, left: 40 }}
//         data={data}
//         animate={true}
//         enableSlices={false}
//         useMesh={true}
//         xScale={{ type: 'point' }}
//         yScale={{
//           type: 'linear',
//           stacked: false,
//           min: 'auto',
//           max: 'auto'
//         }}
//         axisLeft={{
//           tickPadding: 20,
//           legend: '',
//           legendOffset: 0
//         }}
//         axisBottom={{
//           orient: 'bottom'
//         }}
//         curve="monotoneX"
//         enablePointLabel={true}
//         pointSize={6}
//         pointBorderWidth={1}
//         pointBorderColor={{
//           from: 'color',
//           modifiers: [['darker', 0.3]]
//         }}
//         enableGridX={false}
//         enableGridY
//       />
//     );
//   };

  return isLoading && !isLoaded ? (
    <Loading active small={false} withOverlay={true} />
  ) : (
    <div className={styles.dasboardContainer}>
      <div className={styles.dasboardHeader}>
        <div className={styles.nav}>
          <Button
            className={styles.navButton}
            kind="secondary"
            size="small"
            onClick={() => {
              prevMonth();
            }}
            hasIconOnly
            renderIcon={CaretLeft16}
            iconDescription="Previous"
            tooltipPosition="bottom"
          />
          <h4>Stats for {selectedMonthText}</h4>
          <Button
            className={styles.navButton}
            kind="secondary"
            size="small"
            onClick={() => {
              nextMonth();
            }}
            hasIconOnly
            renderIcon={CaretRight16}
            iconDescription="Next"
            tooltipPosition="bottom"
          />
        </div>
        <div className={styles.dropdowns}>
          {renderAccountSelect()}
          {renderYearSelect()}
        </div>
      </div>
      {renderRstats()}
      <div className={styles.monthlyR}>
        <h4>Total R: {getMonthlyRs()}</h4>
      </div>
      <h4>Daily Rs:</h4>
      {/* <div className={styles.dailyChartContainer}>{renderDailyR()}</div>*/}
      <h4>Monthly Equity:</h4>
      {/* <div className={styles.dailyChartContainer}>{renderMonthlyPnL()}</div>*/}
    </div>
  );
}
