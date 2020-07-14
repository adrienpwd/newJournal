import axios from 'axios';

export function loadOverview(day) {
  return dispatch => {
    dispatch({
      type: 'LOAD_OVERVIEW',
      payload: { day }
    });

    axios({
      method: 'get',
      url: `${process.env.REACT_APP_USERS_SERVICE_URL}/overview`,
      params: {
        day
      }
    })
      .then(res => {
        if (res.data.ok === true) {
          dispatch({
            type: 'LOAD_OVERVIEW_SUCCESS',
            payload: res.data
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
}

export function editOverview(overview, data) {
  return dispatch => {
    dispatch({
      type: 'EDIT_OVERVIEW'
    });

    fetch(`${process.env.REACT_APP_USERS_SERVICE_URL}/editOverview`, {
      method: 'PUT',
      body: JSON.stringify({ overview, data }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(results => results.json())
      .then(res => {
        if (res.ok === true) {
          dispatch({
            type: 'EDIT_OVERVIEW_SUCCESS',
            payload: { overview, data }
          });
        }
      })
      .catch(error => {
        dispatch({
          type: 'EDIT_OVERVIEW_ERROR',
          error
        });
      });
  };
}
