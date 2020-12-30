import React, { useState } from 'react';
import {
  NumberInput,
  Slider,
  Toggle,
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell
} from 'carbon-components-react';

import { rHeadersData } from './../../utils';

import styles from './utils.module.css';

export default function Utils() {
  const [currentPrice, setCurrentPrice] = useState(100);
  const initEntryValue = currentPrice - 2;
  const initStopValue = initEntryValue - 0.25;
  const [stopValue, setStopValue] = useState(initStopValue);
  const [entryValue, setEntryValue] = useState(initEntryValue);
  const [tradeLong, setTradeLong] = useState(true);

  const min = Number(currentPrice) - 2;
  const max = Number(currentPrice) + 2;

  const handlePriceChange = e => {
    setCurrentPrice(e.imaginaryTarget.value);
  };

  const handleStopChange = e => {
    setStopValue(Number(e.value));
  };

  const handleEntryChange = e => {
    setEntryValue(Number(e.value));
  };

  const handleSideChange = e => {
    setTradeLong(e);
  };

  const calculateRiskReward = r => {
    let target;
    const stopDistance = Math.abs(entryValue - stopValue);
    if (tradeLong) {
      target = entryValue + r * stopDistance;
    }
    if (!tradeLong) {
      target = entryValue - r * stopDistance;
    }

    return Math.round(target * 100) / 100;
  };

  const renderRtable = r => {
    const rRows = [1, 2, 3, 4, 5, 6].map((r, i) => {
      return {
        id: String(i),
        r,
        target: `$${calculateRiskReward(r)}`,
        move: `$${
          (r * Math.round(Math.abs(entryValue - stopValue) * 100)) / 100
        }`
      };
    });

    return (
      <DataTable
        rows={rRows}
        headers={rHeadersData}
        render={({
          rows,
          headers,
          getHeaderProps,
          getTableProps,
          getRowProps
        }) => (
          <Table {...getTableProps()} size="short">
            <TableHead>
              <TableRow>
                {headers.map(header => {
                  return (
                    <TableHeader {...getHeaderProps({ header })}>
                      {header.header}
                    </TableHeader>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {rRows.map((row, i) => {
                return (
                  <TableRow {...getRowProps({ row })} id={i}>
                    <TableCell id="r" key="r">
                      {row.r}
                    </TableCell>
                    <TableCell id="target" key="target">
                      {row.target}
                    </TableCell>
                    <TableCell id="move" key="move">
                      {row.move}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      />
    );
  };

  return (
    <>
      <div>
        <div className={styles.config}>
          <NumberInput
            id="tj-input"
            invalidText="Number is not valid"
            label="Current Price"
            max={1000}
            min={0}
            step={1}
            value={Number(currentPrice)}
            onChange={handlePriceChange}
          />
          <Toggle
            aria-label="trade side"
            defaultToggled
            id="side-toggle"
            labelText="Long"
            onToggle={handleSideChange}
          />
        </div>
      </div>
      <div className={styles.rTool}>
        <div className={styles.sliderContainer}>
          <Slider
            ariaLabelInput="Stop value"
            id="slider"
            labelText="Stop"
            max={max}
            min={min}
            step={0.01}
            stepMuliplier={40}
            value={stopValue}
            onChange={handleStopChange}
          />
          <Slider
            ariaLabelInput="Entry value"
            id="slider"
            labelText="Entry"
            max={max}
            min={min}
            step={0.01}
            stepMuliplier={40}
            value={entryValue}
            onChange={handleEntryChange}
          />
        </div>
        {renderRtable()}
      </div>
    </>
  );
}
