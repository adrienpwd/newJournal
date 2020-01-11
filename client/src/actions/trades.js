export function loadTrades() {
  return dispatch => {
    dispatch({
      type: 'LOAD_TRADES'
    })

    fetch(`${process.env.REACT_APP_USERS_SERVICE_URL}/trades`)
      .then(results => {
        return results.json()
      })
      .then(data => {
        if (data.ok === true) {
          dispatch({
            type: 'LOAD_TRADES_SUCCESS',
            payload: data
          })
        }
      })
  }
}

export function importFiles(files) {
  return dispatch => {
    dispatch({
      type: 'IMPORT_FILES'
    })

    fetch(`${process.env.REACT_APP_USERS_SERVICE_URL}/importTrades`, {
      method: 'POST',
      body: files
    })
      .then(results => results.json())
      .then(data => {
        if (data.ok === true) {
          dispatch({
            type: 'IMPORT_FILES_SUCCESS',
            payload: data
          })
        }
      })
      .catch(error => {
        dispatch({
          type: 'IMPORT_FILES_ERROR',
          error
        })
      })
  }
}

export function importImages(images) {
  return dispatch => {
    dispatch({
      type: 'IMPORT_IMAGES'
    })

    fetch(`${process.env.REACT_APP_USERS_SERVICE_URL}/importImages`, {
      method: 'POST',
      body: images
    })
      .then(results => results.json())
      .then(data => {
        if (data.ok === true) {
          dispatch({
            type: 'IMPORT_IMAGES_SUCCESS',
            payload: data
          })
        }
      })
      .catch(error => {
        dispatch({
          type: 'IMPORT_IMAGES_ERROR',
          error
        })
      })
  }
}
