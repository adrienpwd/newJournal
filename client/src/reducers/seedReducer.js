const initial_state = {
  error: null,
  loading: false,
  loaded: false,
  seeds: []
};

const groupBy = (list, keyGetter) => {
  const seedsByDay = {};
  list.forEach(item => {
    const key = keyGetter(item);
    const collection = seedsByDay[key];
    if (!collection) {
      seedsByDay[key] = [item];
    } else {
      collection.push(item);
    }
  });

  return seedsByDay;
};

const onLoadSeedsSuccess = (state, payload) => {
  const { seeds } = payload;
  const newSeeds = groupBy(seeds, seed => {
    // Days in the seed have YYYY/MM/DD format
    // It messes up the app when we try to use the day in the router
    // So I have to change to YYYY-MM-DD (- instead of /)
    const formattedDay = seed.id.substring(0, 10).replace(/\//g, '-');
    return formattedDay;
  });

  return {
    ...state,
    seeds: { ...state.seeds, ...newSeeds },
    loading: false,
    loaded: true
  };
};

const onEditSeedSuccess = (state, { seed }) => {
  const formattedDay = seed.id.substring(0, 10).replace(/\//g, '-');
  let updatedSeeds;
  if (state.seeds[formattedDay]) {
    updatedSeeds = state.seeds[formattedDay].map(s => {
      if (s.id === seed.id) return seed;
      return s;
    });
    console.log(updatedSeeds);
  } else {
    updatedSeeds = [seed];
  }

  return {
    ...state,
    seeds: {
      ...state.seeds,
      [formattedDay]: updatedSeeds
    }
  };
};

const onDeleteSeedSuccess = (state, { seedId }) => {
  const formattedDay = seedId.substring(0, 10).replace(/\//g, '-');
  let updatedSeeds;
  if (state.seeds[formattedDay]) {
    updatedSeeds = [...state.seeds[formattedDay]];
    const seedIndex = updatedSeeds.findIndex(s => s.id === seedId);
    updatedSeeds.splice(seedIndex, 1);
  }

  return {
    ...state,
    seeds: {
      ...state.seeds,
      [formattedDay]: updatedSeeds
    }
  };
};

export default function seedReducer(state = initial_state, action = {}) {
  const { type, payload } = action;

  switch (type) {
    case 'LOAD_SEEDS_SUCCESS':
      return onLoadSeedsSuccess(state, payload);
    case 'EDIT_SEED_SUCCESS':
      return onEditSeedSuccess(state, payload);
    case 'DELETE_SEED_SUCCESS':
      return onDeleteSeedSuccess(state, payload);
    default:
      return state;
  }
};
