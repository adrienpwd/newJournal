const initial_state = {
  error: null,
  loading: false,
  loaded: false,
  sets: {}
};

function chunkArray(array, size) {
  let result = [];
  for (let i = 0; i < array.length; i += size) {
    let chunk = array.slice(i, i + size);
    result.push(chunk);
  }
  return result;
}

const onLoadStrategy = (state, payload) => {
  return {
    ...state,
    loading: true,
    loaded: false
  };
};

const onLoadStrategySuccess = (state, payload) => {
  const { strategy, sets } = payload;

  const sets20 = chunkArray(sets, 20);

  return {
    ...state,
    sets: { ...state.sets, [strategy]: sets20 },
    loading: false,
    loaded: true
  };
};

export default (state = initial_state, action = {}) => {
  const { type, payload, error } = action;

  switch (type) {
    case 'LOAD_STRATEGY_STATS':
      return onLoadStrategy(state, payload);
    case 'LOAD_STRATEGY_STATS_SUCCESS':
      return onLoadStrategySuccess(state, payload);
    default:
      return state;
  }
};
