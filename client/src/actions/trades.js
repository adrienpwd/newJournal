import axios from 'axios';

// process.env.REACT_APP_USERS_SERVICE_URL has to be set to "http://localhost:5001"
// Need to be do (root of the project)

// For DEV env
// export REACT_APP_USERS_SERVICE_URL=http://localhost:5001

// For PROD env
// export REACT_APP_USERS_SERVICE_URL=http://192.168.1.70:5001
// Make sure the IP of the server (Intel NUC computer) didn't change

export function loadTrades(start, end) {
  return dispatch => {
    dispatch({
      type: 'LOAD_TRADES'
    });

    axios({
      method: 'get',
      url: `${process.env.REACT_APP_USERS_SERVICE_URL}/trades`,
      params: {
        start,
        end
      }
    })
      .then(res => {
        if (res.data.ok === true) {
          dispatch({
            type: 'LOAD_TRADES_SUCCESS',
            payload: res.data
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
}

export function importFiles(files) {
  return dispatch => {
    dispatch({
      type: 'IMPORT_FILES'
    });

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
          });
        }
      })
      .catch(error => {
        dispatch({
          type: 'IMPORT_FILES_ERROR',
          error
        });
      });
  };
}

export function uploadImages(images, type, day) {
  return dispatch => {
    dispatch({
      type: 'IMPORT_IMAGES'
    });

    const formattedDay = encodeURIComponent(day);

    fetch(
      `${process.env.REACT_APP_USERS_SERVICE_URL}/uploadImages?type=${type}&day=${formattedDay}`,
      {
        method: 'POST',
        body: images
      }
    )
      .then(results => results.json())
      .then(data => {
        if (data.ok === true) {
          dispatch({
            type: 'UPLOAD_IMAGES_SUCCESS',
            payload: data
          });
        }
      })
      .catch(error => {
        console.log(error);
        dispatch({
          type: 'UPLOAD_IMAGES_ERROR',
          error
        });
      });
  };
}

export function editTrade(trade, data) {
  return dispatch => {
    dispatch({
      type: 'EDIT_TRADE'
    });

    fetch(`${process.env.REACT_APP_USERS_SERVICE_URL}/editTrade`, {
      method: 'PUT',
      body: JSON.stringify({ trade, data }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(results => results.json())
      .then(res => {
        if (res.ok === true) {
          dispatch({
            type: 'EDIT_TRADE_SUCCESS',
            payload: { trade, data }
          });
        }
      })
      .catch(error => {
        dispatch({
          type: 'EDIT_TRADE_ERROR',
          error
        });
      });
  };
}

export function importImages() {
  return axios({
    method: 'get',
    url: `${process.env.REACT_APP_USERS_SERVICE_URL}/importImages`,
    responseType: 'blob'
  });
}
