import React, { useState, useEffect } from 'react';
import { Loading } from 'carbon-components-react';

import styles from './rstats.module.css';

const Rstats = ({ account, data }) => {
  if (!data.loaded) {
    return <Loading active small={false} withOverlay={true} />;
  } else {
    const avgR = data?.totalTrades?.[account]?.[0];
    const numberOfTrades = data?.totalTrades?.[account]?.[1];

    const displayHeader = () => {
      if (!isNaN(numberOfTrades) && !isNaN(avgR)) {
        return (
          <h4>{`${numberOfTrades} trades, Avg. R: ${avgR?.toFixed(2)}`}</h4>
        );
      }
    };

    const getRdisplay = v => {
      if (!v) {
        return 'No Data';
      }
      const r = v?.[0];
      const count = v?.[1];
      return (
        <div className={styles.itemStatsContainer}>
          <span className={styles.itemStats}>
            {`${count} trades (${
              Math.round((count / numberOfTrades) * 1000) / 10
            }%)`}
          </span>
          <span className={styles.itemStats}>Avg. R: {r?.toFixed(2)}</span>
        </div>
      );
    };

    return (
      <div className={styles.rStatsContainer}>
        {displayHeader()}
        <div className={styles.rContainer}>
          <div className={styles.rItem}>
            <h4 className={styles.rHeader}>Big Losers</h4>
            <span>{getRdisplay(data?.bigLosers?.[account])}</span>
          </div>
          <div className={styles.rItem}>
            <h4 className={styles.rHeader}>Losers</h4>
            <span>{getRdisplay(data?.losers?.[account])}</span>
          </div>
          <div className={styles.rItem}>
            <h4 className={styles.rHeader}>Winners</h4>
            <span>{getRdisplay(data?.winners?.[account])}</span>
          </div>
          <div className={styles.rItem}>
            <h4 className={styles.rHeader}>Big Winners</h4>
            <span>{getRdisplay(data?.bigWinners?.[account])}</span>
          </div>
        </div>
      </div>
    );
  }
};

export default Rstats;
