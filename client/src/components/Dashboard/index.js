import React, { useEffect } from 'react';
import { getStats, setAccount } from './../../actions/dashboard';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Select, SelectItem } from 'carbon-components-react';
import { Loading } from 'carbon-components-react';
import { Line } from '@nivo/line';
import { accounts } from './../../utils';
import { useHistory } from 'react-router-dom';

import styles from './dashboard.module.css';

export default function Dashboard(props) {
  const dispatch = useDispatch();
  const dashboardState = useSelector(state => state.dashboardReducer);
  const { register } = useForm();
  const history = useHistory();

  useEffect(() => {
    dispatch(getStats());
  }, []);

  const isLoading = dashboardState?.loading;
  const isLoaded = dashboardState?.loaded;
  const dailyPNL = dashboardState?.dailyPNL;
  const account = dashboardState?.account;

  const handleAccountChange = e => {
    dispatch(setAccount(e.target.value));
  };

  const renderAccountSelect = () => {
    return (
      <Select
        ref={register}
        onChange={handleAccountChange}
        id="account"
        name="account"
        invalidText="This is an invalid error message."
        labelText="Account"
        defaultValue={accounts[0]}
      >
        {accounts.map(s => (
          <SelectItem text={s.label} value={s.id} key={s.id} />
        ))}
      </Select>
    );
  };

  const renderRstats = () => {
    const getRdisplay = v => {
      const rValue = v ? v : 0;
      return (
        <span>
          {`${rValue} / ${dashboardState.totalTradesByAccount?.[account]} (${
            Math.round(
              (rValue / dashboardState.totalTradesByAccount?.[account]) * 1000
            ) / 10
          }%)`}
        </span>
      );
    };
    return (
      <div className={styles.rContainer}>
        <div className={styles.rItem}>
          <h4 className={styles.rHeader}>Big Losers</h4>
          <span>{getRdisplay(dashboardState?.bigLosers?.[account])}</span>
        </div>
        <div className={styles.rItem}>
          <h4 className={styles.rHeader}>Losers</h4>
          <span>{getRdisplay(dashboardState?.losers?.[account])}</span>
        </div>
        <div className={styles.rItem}>
          <h4 className={styles.rHeader}>Winners</h4>
          <span>{getRdisplay(dashboardState?.winners?.[account])}</span>
        </div>
        <div className={styles.rItem}>
          <h4 className={styles.rHeader}>Big Winners</h4>
          <span>{getRdisplay(dashboardState?.bigWinners?.[account])}</span>
        </div>
      </div>
    );
  };

  const handlePnLClick = (point, event) => {
    const day = point.data.xFormatted;
    history.push(`/review/${day}`);
  };

  const renderDailyPnL = () => {
    const data = [
      {
        id: 'pnl',
        data: dailyPNL[0]
      }
    ];

    return (
      <Line
        onClick={handlePnLClick}
        width={900}
        height={400}
        margin={{ top: 20, right: 20, bottom: 200, left: 30 }}
        data={data}
        animate={true}
        enableSlices={false}
        useMesh={true}
        xScale={{
          type: 'time',
          format: '%d-%m-%Y',
          useUTC: false,
          precision: 'day',
          min: 'auto',
          max: 'auto'
        }}
        xFormat="time:%d-%m-%Y"
        yScale={{
          type: 'linear',
          stacked: false,
          min: 'auto',
          max: 'auto'
        }}
        axisLeft={{
          legend: '',
          legendOffset: 0
        }}
        axisBottom={{
          format: '%b %d',
          tickValues: 'every 1 day',
          legend: '',
          legendOffset: 0
        }}
        curve="monotoneX"
        enablePointLabel={true}
        pointSize={6}
        pointBorderWidth={1}
        pointBorderColor={{
          from: 'color',
          modifiers: [['darker', 0.3]]
        }}
        enableGridX={false}
        enableGridY
      />
    );
  };

  const renderDailyR = () => {
    const data = [
      {
        id: 'r',
        data: dailyPNL[1]
      }
    ];

    return (
      <Line
        account={account}
        width={900}
        height={400}
        margin={{ top: 20, right: 20, bottom: 200, left: 30 }}
        data={data}
        animate={true}
        enableSlices="x"
        data={data}
        xScale={{
          type: 'time',
          format: '%d-%m-%Y',
          useUTC: false,
          precision: 'day'
        }}
        xFormat="time:%d-%m-%Y"
        yScale={{
          type: 'linear',
          stacked: false,
          min: 'auto',
          max: 'auto'
        }}
        axisLeft={{
          legend: '',
          legendOffset: 0
        }}
        axisBottom={{
          format: '%b %d',
          tickValues: 'every 1 day',
          legend: '',
          legendOffset: 0
        }}
        curve="monotoneX"
        enablePointLabel={true}
        pointSize={6}
        pointBorderWidth={1}
        pointBorderColor={{
          from: 'color',
          modifiers: [['darker', 0.3]]
        }}
        enableGridX={false}
        enableGridY
      />
    );
  };

  return isLoading && !isLoaded ? (
    <Loading active small={false} withOverlay={true} />
  ) : (
    <div className={styles.dasboardContainer}>
      {renderAccountSelect()}
      {renderRstats()}
      <h4>Daily P&L:</h4>
      <div className={styles.dailyChartContainer}>{renderDailyPnL()}</div>
      <h4>Daily Risk to Reward ratio:</h4>
      <div className={styles.dailyChartContainer}>{renderDailyR()}</div>
    </div>
  );
}
