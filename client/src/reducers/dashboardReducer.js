const initial_state = {
  loading: true,
  loaded: false
}

const onGetStats = (state) => {
  const newState = {
    ...state,
    loading: true
  }

  return newState
}

const onGetStatsSuccess = (state, payload) => {
  const newState = {
    ...state,
    ...payload,
    loading: false,
    loaded: true
  }

  return newState
}

const onGetStatsError = (state, error) => {
  const newState = {
    ...state,
    error,
    loading: false,
    loaded: true
  }

  return newState
}

export default (state = initial_state, action = {}) => {
  const { type, payload, error } = action
  switch (type) {
    case 'GET_STATS':
      return onGetStats(state)
    case 'GET_STATS_SUCCESS':
      return onGetStatsSuccess(state, payload)
    case 'GET_STATS_ERROR':
      return onGetStatsError(state, error)
    default:
      return state
  }
}
