import axios from 'axios';

export function loadStrategy(strategy, account) {
  return dispatch => {
    dispatch({
      type: 'LOAD_STRATEGY_STATS'
    });

    axios({
      method: 'get',
      url: `${process.env.REACT_APP_USERS_SERVICE_URL}/strategy`,
      params: {
        strategy,
        account
      }
    })
      .then(res => {
        if (res.data.ok === true) {
          dispatch({
            type: 'LOAD_STRATEGY_STATS_SUCCESS',
            payload: { strategy, sets: res.data.sets }
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
}
