import React from 'react';
import {
  Tabs,
  Tab,
  OrderedList,
  UnorderedList,
  ListItem
} from 'carbon-components-react';
import Rules from './rules';
import Strategies from './strategies';

export default function Tradebook() {
  return (
    <div>
      <h4>Tradebook</h4>
      <Tabs>
        <Tab id="strategies" label="Strategies">
          <Strategies />
        </Tab>
        <Tab id="rules" label="Rules">
          <Rules />
        </Tab>
      </Tabs>
    </div>
  );
}
