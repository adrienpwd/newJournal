import { accounts, transformPNL, transformRstats } from './../utils';

const initial_state = {
  loading: true,
  loaded: false,
  account: accounts[0].id
};

const onGetStats = state => {
  const newState = {
    ...state,
    loading: true
  };

  return newState;
};

const onGetStatsSuccess = (state, payload) => {
  const dailyPNL = payload?.pnl_per_day;
  const dailyPNLtransformed = dailyPNL
    ? transformPNL(dailyPNL, state.account)
    : [[], []];
  const rStats = transformRstats(payload);
  const { bigLosers, bigWinners, losers, winners, totalTrades } = rStats;
  const newState = {
    ...state,
    rawDailyPNL: dailyPNL,
    dailyPNL: dailyPNLtransformed,
    bigLosers,
    bigWinners,
    losers,
    winners,
    totalTrades,
    loading: false,
    loaded: true
  };

  return newState;
};

const onGetStatsError = (state, error) => {
  const newState = {
    ...state,
    error,
    loading: false,
    loaded: true
  };

  return newState;
};

const onSetAccount = (state, payload) => {
  return {
    ...state,
    account: payload
  };
};

export default function dashboardReducer(state = initial_state, action = {}) {
  const { type, payload, error } = action;
  switch (type) {
    case 'GET_STATS':
      return onGetStats(state);
    case 'GET_STATS_SUCCESS':
      return onGetStatsSuccess(state, payload);
    case 'GET_STATS_ERROR':
      return onGetStatsError(state, error);
    case 'SET_ACCOUNT':
      return onSetAccount(state, payload);
    default:
      return state;
  }
};
