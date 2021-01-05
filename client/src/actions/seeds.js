import axios from 'axios';

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
            payload: { seed, data }
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
