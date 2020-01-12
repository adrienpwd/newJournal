const initial_state = {
  error: null,
  loading: false,
  loaded: false,
  trades: []
}

const groupBy = (list, keyGetter) => {
  const tradesByDay = {}
  list.forEach(item => {
    const key = keyGetter(item)
    const collection = tradesByDay[key]
    if (!collection) {
      tradesByDay[key] = [item]
    } else {
      collection.push(item)
    }
  })

  return tradesByDay
}

const onLoadTradeSuccess = (state, payload) => {
  const { trades } = payload

  return {
    ...state,
    trades: groupBy(trades, trade => {
      // Days in the trade have YYYY/MM/DD format
      // It messes up the app when we try to use the day in the router
      // So I have to change to YYYY-MM-DD (- instead of /)
      const formattedDay = trade.time.substring(0, 10).replace(/\//g, '-')
      return formattedDay
    }),
    loading: false,
    loaded: true
  }
}

export default (state = initial_state, action = {}) => {
  const { type, payload, error } = action

  switch (type) {
    case 'LOAD_TRADES_SUCCESS':
      return onLoadTradeSuccess(state, payload)
    default:
      return state
  }
}
