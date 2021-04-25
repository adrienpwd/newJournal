import axios from 'axios';

export function loadSets(strategy) {
  return dispatch => {
    dispatch({
      type: 'LOAD_SETS'
    });

    axios({
      method: 'get',
      url: `${process.env.REACT_APP_USERS_SERVICE_URL}/sets`,
      params: {
        strategy
      }
    })
      .then(res => {
        if (res.data.ok === true) {
          dispatch({
            type: 'LOAD_SETS_SUCCESS',
            payload: {strategy, sets: res.data.sets}
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
}