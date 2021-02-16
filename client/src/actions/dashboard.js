import axios from 'axios'

export function getStats(account, start, end) {
  return (dispatch) => {
    dispatch({
      type: 'GET_STATS'
    })

    axios({
      method: 'get',
      url: `${process.env.REACT_APP_USERS_SERVICE_URL}/statistics`,
      params: {
        account,
        start,
        end
      }
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

export function setPeriod(period) {
  return (dispatch) => {
    dispatch({
      type: 'SET_PERIOD',
      payload: period
    })
  }
}
