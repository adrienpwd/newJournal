import axios from 'axios';

export function loadSeeds(start, end) {
  return dispatch => {
    dispatch({
      type: 'LOAD_SEEDS',
      payload: { start, end }
    });

    axios({
      method: 'get',
      url: `${process.env.REACT_APP_USERS_SERVICE_URL}/seeds`,
      params: {
        start,
        end
      }
    })
      .then(res => {
        if (res.data.ok === true) {
          dispatch({
            type: 'LOAD_SEEDS_SUCCESS',
            payload: res.data
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
}

export function editSeed(seed, data) {
  return dispatch => {
    dispatch({
      type: 'EDIT_SEED'
    });

    fetch(`${process.env.REACT_APP_USERS_SERVICE_URL}/editSeed`, {
      method: 'PUT',
      body: JSON.stringify({ seed, data }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(results => results.json())
      .then(res => {
        if (res.ok === true) {
          dispatch({
            type: 'EDIT_SEED_SUCCESS',
            payload: { seed: res.seed }
          });
        }
      })
      .catch(error => {
        console.log(error);
        dispatch({
          type: 'EDIT_SEED_ERROR',
          error
        });
      });
  };
}

export function editTradeLink(currentSeedId, newSeedId, tradeId) {
  return dispatch => {
    dispatch({
      type: 'EDIT_TRADE_LINK'
    });

    fetch(`${process.env.REACT_APP_USERS_SERVICE_URL}/editTradeLink`, {
      method: 'PUT',
      body: JSON.stringify({
        currentSeedId,
        newSeedId,
        tradeId
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(results => results.json())
      .then(res => {
        if (res.ok === true) {
          dispatch({
            type: 'EDIT_SEED_SUCCESS',
            payload: { seed: res.seed }
          });
        }
      })
      .catch(error => {
        console.log(error);
        dispatch({
          type: 'EDIT_TRADE_LINK_ERROR',
          error
        });
      });
  };
}
