const initial_state = {
  error: null,
  overviews: {}
};

const onLoadOverview = (state, { day }) => {
  return {
    ...state,
    overviews: {
      ...state.overviews,
      [day]: {
        loading: true,
        loaded: false
      }
    }
  };
};

const onLoadOverviewSuccess = (state, payload) => {
  const { overview } = payload;

  return {
    ...state,
    overviews: {
      ...state.overviews,
      [overview.id]: { loading: false, loaded: true, overview }
    }
  };
};

const onEditOverviewSuccess = (state, { overview, data }) => {
  const updatedOverviews = state.overviews.map(o => {
    if (o.id === overview.id) return { ...overview, ...data };
    return o;
  });

  return {
    ...state,
    overviews: updatedOverviews
  };
};

export default (state = initial_state, action = {}) => {
  const { type, payload, error } = action;

  switch (type) {
    case 'LOAD_OVERVIEW':
      return onLoadOverview(state, payload);
    case 'LOAD_OVERVIEW_SUCCESS':
      return onLoadOverviewSuccess(state, payload);
    case 'EDIT_OVERVIEW_SUCCESS':
      return onEditOverviewSuccess(state, payload);
    default:
      return state;
  }
};
