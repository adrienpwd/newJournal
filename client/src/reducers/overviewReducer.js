const initial_state = {
  error: null,
  loading: false,
  loaded: false,
  overviews: {}
}

const onLoadOverview = (state, payload) => {
  return {
    ...state,
    loading: true,
    loaded: false
  }
}

const onLoadOverviewSuccess = (state, payload) => {
  const { overview } = payload

  console.log('payload', payload)

  return {
    ...state,
    overviews: {
      ...state.overviews,
      [overview.id]: overview
    },
    loading: false,
    loaded: true
  }
}

const onEditOverviewSuccess = (state, { overview, data }) => {
  const updatedOverviews = state.overviews.map((o) => {
    if (o.id === overview.id) return { ...overview, ...data }
    return o
  })

  return {
    ...state,
    overviews: updatedOverviews
  }
}

export default (state = initial_state, action = {}) => {
  const { type, payload, error } = action

  switch (type) {
    case 'LOAD_OVERVIEW':
      return onLoadOverview(state, payload)
    case 'LOAD_OVERVIEW_SUCCESS':
      return onLoadOverviewSuccess(state, payload)
    case 'EDIT_OVERVIEW_SUCCESS':
      return onEditOverviewSuccess(state, payload)
    default:
      return state
  }
}
