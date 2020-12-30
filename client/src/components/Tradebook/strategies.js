import React, { useState } from 'react';
import { UnorderedList, ListItem } from 'carbon-components-react';
import { strategies, getStrategie } from './../../utils';
import Strategy from './strategy';

import styles from './strategies.module.css';

export default function Strategies() {
  const [strategyId, setStrategieId] = useState('range');

  const onStrategieClick = s => {
    setStrategieId(s);
  };

  return (
    <div className={styles.container}>
      <div className={styles.strategiesList}>
        <UnorderedList>
          <h4>Breakouts</h4>
          <ListItem
            className={styles.strategyLink}
            onClick={() => onStrategieClick('range')}
          >
            Range
          </ListItem>
          <ListItem
            className={styles.strategyLink}
            onClick={() => onStrategieClick('wedge')}
          >
            Wedge
          </ListItem>
          <ListItem
            className={styles.strategyLink}
            onClick={() => onStrategieClick('triangle')}
          >
            Triangle
          </ListItem>
          <ListItem
            className={styles.strategyLink}
            onClick={() => onStrategieClick('3-bars-play')}
          >
            3 Bars play
          </ListItem>
          <ListItem
            className={styles.strategyLink}
            onClick={() => onStrategieClick('orb')}
          >
            ORB
          </ListItem>
          <br />
          <h4>Reversals</h4>
          <ListItem
            className={styles.strategyLink}
            onClick={() => onStrategieClick('climactic-reversal')}
          >
            Climactic Reversal
          </ListItem>
          <ListItem
            className={styles.strategyLink}
            onClick={() => onStrategieClick('extreme-reversal')}
          >
            Extreme Reversal
          </ListItem>
          <ListItem
            className={styles.strategyLink}
            onClick={() => onStrategieClick('mountain-pass')}
          >
            Mountain Pass
          </ListItem>
          <br />
          <h4>Trends</h4>
          <ListItem
            className={styles.strategyLink}
            onClick={() => onStrategieClick('abcd-1')}
          >
            ABCD type 1
          </ListItem>
          <ListItem
            className={styles.strategyLink}
            onClick={() => onStrategieClick('abcd-2')}
          >
            ABCD type 2
          </ListItem>
          <ListItem
            className={styles.strategyLink}
            onClick={() => onStrategieClick('abcd-3')}
          >
            ABCD type 3
          </ListItem>
          <ListItem
            className={styles.strategyLink}
            onClick={() => onStrategieClick('trendline-break')}
          >
            Trend Line Break
          </ListItem>
        </UnorderedList>
      </div>
      <Strategy strategyId={strategyId} />
    </div>
  );
}
