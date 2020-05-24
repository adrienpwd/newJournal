import axios from 'axios'

// process.env.REACT_APP_USERS_SERVICE_URL has to be set to "http://localhost:5001"
// Need to be do (root of the project)
// export REACT_APP_USERS_SERVICE_URL=http://localhost:5001

export function loadTrades() {
  return (dispatch) => {
    dispatch({
      type: 'LOAD_TRADES'
    })

    axios
      .get(`${process.env.REACT_APP_USERS_SERVICE_URL}/trades`)
      .then((res) => {
        if (res.data.ok === true) {
          dispatch({
            type: 'LOAD_TRADES_SUCCESS',
            payload: res.data
          })
        }
      })
      .catch((err) => {
        console.log(err)
      })

    // fetch(`${process.env.REACT_APP_USERS_SERVICE_URL}/trades`)
    //   .then(results => {
    //     console.log(results)
    //     return results.json()
    //   })
    //   .then(data => {
    //     if (data.ok === true) {
    //       dispatch({
    //         type: 'LOAD_TRADES_SUCCESS',
    //         payload: data
    //       })
    //     }
    //   })
  }
}

export function importFiles(files) {
  return (dispatch) => {
    dispatch({
      type: 'IMPORT_FILES'
    })

    fetch(`${process.env.REACT_APP_USERS_SERVICE_URL}/importTrades`, {
      method: 'POST',
      body: files
    })
      .then((results) => results.json())
      .then((data) => {
        if (data.ok === true) {
          dispatch({
            type: 'IMPORT_FILES_SUCCESS',
            payload: data
          })
        }
      })
      .catch((error) => {
        dispatch({
          type: 'IMPORT_FILES_ERROR',
          error
        })
      })
  }
}

export function importImages(images) {
  return (dispatch) => {
    dispatch({
      type: 'IMPORT_IMAGES'
    })

    fetch(`${process.env.REACT_APP_USERS_SERVICE_URL}/importImages`, {
      method: 'POST',
      body: images
    })
      .then((results) => results.json())
      .then((data) => {
        if (data.ok === true) {
          dispatch({
            type: 'IMPORT_IMAGES_SUCCESS',
            payload: data
          })
        }
      })
      .catch((error) => {
        dispatch({
          type: 'IMPORT_IMAGES_ERROR',
          error
        })
      })
  }
}

export function editTrade(trade, data) {
  return (dispatch) => {
    dispatch({
      type: 'EDIT_TRADE'
    })

    fetch(`${process.env.REACT_APP_USERS_SERVICE_URL}/editTrade`, {
      method: 'PUT',
      body: JSON.stringify({ trade, data }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((results) => results.json())
      .then((data) => {
        if (data.ok === true) {
          dispatch({
            type: 'EDIT_TRADE_SUCCESS'
          })
        }
      })
      .catch((error) => {
        dispatch({
          type: 'EDIT_TRADE_ERROR',
          error
        })
      })
  }
}
