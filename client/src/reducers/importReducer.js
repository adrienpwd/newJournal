import aggregatedTrades from './../mock_data/aggregatedTrades'

const initial_state = {
  error: null,
  error: null,
  building: false,
  built: false,
  rawOrders: [],
  rawTrades: [],
  aggregatedTrades
}

const onGetBuiltFiles = (state, payload) => {
  return {
    ...state,
    building: true
  }
}

const onGetBuiltFilesSuccess = (state, payload) => {
  const { aggregatedTrades, trades, orders } = payload
  const aggregatedTradesObj = {}
  aggregatedTrades.forEach(trade => {
    aggregatedTradesObj[trade._id] = trade
  })

  console.log(aggregatedTradesObj)

  return {
    ...state,
    building: false,
    built: true,
    aggregatedTrades: aggregatedTradesObj,
    trades,
    orders
  }
}

const onImportImagesSuccess = (state, payload) => {
  const { imagePathes, tradeId } = payload
  const newAggregatedTrade = state.aggregatedTrades[tradeId]
  newAggregatedTrade.img = newAggregatedTrade.img.concat(imagePathes)
  state.aggregatedTrades[tradeId] = newAggregatedTrade

  return state
}

export default (state = initial_state, action = {}) => {
  const { type, payload, error } = action
  switch (type) {
    case 'IMPORT_FILES':
      return onGetBuiltFiles(state, payload)
    case 'IMPORT_FILES_SUCCESS':
      return onGetBuiltFilesSuccess(state, payload)
    case 'IMPORT_IMAGES_SUCCESS':
      return onImportImagesSuccess(state, payload)
    default:
      return state
  }
}
