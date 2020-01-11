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

  return {
    ...state,
    trades: groupBy(trades, trade => trade.time.substring(0, 10)),
    loading: false,
    loaded: true
  };
};

export default (state = initial_state, action = {}) => {
  const { type, payload, error } = action;

  switch (type) {
    case "LOAD_TRADES_SUCCESS":
      return onLoadTradeSuccess(state, payload);
    default:
      return state;
  }
};
