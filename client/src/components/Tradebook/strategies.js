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
          <ListItem onClick={() => onStrategieClick('consolidation')}>
            Consolidation
          </ListItem>
          <ListItem onClick={() => onStrategieClick('range')}>Range</ListItem>
          <ListItem onClick={() => onStrategieClick('wedge')}>Wedge</ListItem>
          <ListItem onClick={() => onStrategieClick('triangle')}>
            Triangle
          </ListItem>
          <ListItem onClick={() => onStrategieClick('3-bars-play')}>
            3 Bars play
          </ListItem>
          <ListItem onClick={() => onStrategieClick('orb')}>ORB</ListItem>
          <br />
          <h4>Reversals</h4>
          <ListItem onClick={() => onStrategieClick('climactic-reversal')}>
            Climactic Reversal
          </ListItem>
          <ListItem onClick={() => onStrategieClick('extreme-reversal')}>
            Extreme Reversal
          </ListItem>
          <ListItem onClick={() => onStrategieClick('mountain-pass')}>
            Mountain Pass
          </ListItem>
          <br />
          <h4>Trends</h4>
          <ListItem onClick={() => onStrategieClick('abcd-1')}>
            ABCD type 1
          </ListItem>
          <ListItem onClick={() => onStrategieClick('abcd-2')}>
            ABCD type 2
          </ListItem>
          <ListItem onClick={() => onStrategieClick('abcd-3')}>
            ABCD type 3
          </ListItem>
          <ListItem onClick={() => onStrategieClick('trendline-break')}>
            Trend Line Break
          </ListItem>
        </UnorderedList>
      </div>
      <Strategy strategyId={strategyId} />
    </div>
  );
}
