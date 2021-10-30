const initial_state = {
  error: null,
  loading: false,
  loaded: false,
  trades: []
};

const groupBy = (list, keyGetter) => {
  const tradesByDay = {};
  list.forEach(item => {
    const key = keyGetter(item);
    const collection = tradesByDay[key];
    if (!collection) {
      tradesByDay[key] = [item];
    } else {
      collection.push(item);
    }
  });

  return tradesByDay;
};

const onLoadTradeSuccess = (state, payload) => {
  const { trades } = payload;
  const newTrades = groupBy(trades, trade => {
    // Days in the trade have YYYY/MM/DD format
    // It messes up the app when we try to use the day in the router
    // So I have to change to YYYY-MM-DD (- instead of /)
    const formattedDay = trade.time.substring(0, 10).replace(/\//g, '-');
    return formattedDay;
  });

  return {
    ...state,
    trades: { ...state.trades, ...newTrades },
    loading: false,
    loaded: true
  };
};

const onEditTradeSuccess = (state, { trade, data }) => {
  const formattedDay = trade.time.substring(0, 10).replace(/\//g, '-');
  const updatedTrades = state.trades[formattedDay].map(t => {
    if (t.id === trade.id) return { ...trade, ...data };
    return t;
  });

  return {
    ...state,
    trades: {
      ...state.trades,
      [formattedDay]: updatedTrades
    }
  };
};

export default function tradeReducer(state = initial_state, action = {}) {
  const { type, payload } = action;

  switch (type) {
    case 'LOAD_TRADES_SUCCESS':
      return onLoadTradeSuccess(state, payload);
    case 'EDIT_TRADE_SUCCESS':
      return onEditTradeSuccess(state, payload);
    default:
      return state;
  }
};
