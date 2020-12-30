const initial_state = {
  error: null,
  overviews: {}
};

const onLoadOverviews = (state, { start, end }) => {
  return {
    ...state,
    loading: true,
    loaded: false
  };
};

const onLoadOverviewSuccess = (state, payload) => {
  const { overviews } = payload;
  return {
    loading: false,
    loaded: true,
    overviews: {
      ...state.overviews,
      ...overviews
    }
  };
};

const onEditOverviewSuccess = (state, { overview, data }) => {
  const editedOverview = {
    ...state.overviews[overview.id],
    overview: {
      ...state.overviews[overview.id]?.overview,
      ...data
    }
  };

  return {
    ...state,
    overviews: {
      ...state.overviews,
      [overview.id]: editedOverview
    }
  };
};

export default (state = initial_state, action = {}) => {
  const { type, payload, error } = action;

  switch (type) {
    case 'LOAD_OVERVIEW':
      return onLoadOverviews(state, payload);
    case 'LOAD_OVERVIEW_SUCCESS':
      return onLoadOverviewSuccess(state, payload);
    case 'EDIT_OVERVIEW_SUCCESS':
      return onEditOverviewSuccess(state, payload);
    default:
      return state;
  }
};
