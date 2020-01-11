import React, { useEffect } from "react";
import { loadTrades } from "./../../actions/trades";
import { useDispatch, useSelector } from "react-redux";

export default function Trades() {
  const data = useSelector(state => state.tradeReducer);
  const dispatch = useDispatch();
  const tradesByDay = data.trades;

  useEffect(() => {
    dispatch(loadTrades());
  }, []);

  return (
    <div>
      Trades:
      {tradesByDay && (
        <ul>
          {Object.keys(tradesByDay).map(day => {
            return <li key={day}>{day}</li>;
          })}
        </ul>
      )}
    </div>
  );
}
