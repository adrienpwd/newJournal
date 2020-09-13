import axios from 'axios'

export function getStats() {
  return (dispatch) => {
    dispatch({
      type: 'GET_STATS'
    })

    axios({
      method: 'get',
      url: `${process.env.REACT_APP_USERS_SERVICE_URL}/statistics`
    })
      .then((res) => {
        if (res.data.ok === true) {
          dispatch({
            type: 'GET_STATS_SUCCESS',
            payload: res.data
          })
        }
      })
      .catch((err) => {
        dispatch({
          type: 'GET_STATS_ERROR',
          error: err
        })
      })
  }
}

export function setAccount(account) {
  return (dispatch) => {
    dispatch({
      type: 'SET_ACCOUNT',
      payload: account
    })
  }
}
