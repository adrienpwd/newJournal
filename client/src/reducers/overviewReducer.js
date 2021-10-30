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
  const overviewObject = {};
  for (let i = 0; i < overviews.length; i++) {
    overviewObject[overviews[i].id] = overviews[i];
  }
  return {
    loading: false,
    loaded: true,
    overviews: {
      ...overviewObject
    }
  };
};

const onEditOverviewSuccess = (state, { overview }) => {
  return {
    ...state,
    overviews: {
      ...state.overviews,
      [overview.id]: { ...state.overviews[overview.id], ...overview }
    }
  };
};

export default function overviewReducer(state = initial_state, action = {}) {
  const { type, payload } = action;

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
