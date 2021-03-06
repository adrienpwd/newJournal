import axios from 'axios';

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

export function uploadImages(images, type, day, id) {
  return dispatch => {
    dispatch({
      type: 'IMPORT_IMAGES'
    });

    const formattedDay = encodeURIComponent(day);

    fetch(
      `${process.env.REACT_APP_USERS_SERVICE_URL}/uploadImages?type=${type}&day=${formattedDay}&id=${id}`,
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

export function deleteImage(type, id, imgId) {
  return dispatch => {
    dispatch({
      type: 'DELETE_IMAGE'
    });

    fetch(`${process.env.REACT_APP_USERS_SERVICE_URL}/deleteImage`, {
      method: 'PUT',
      body: JSON.stringify({ type, id, imgId }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(results => results.json())
      .then(res => {
        if (res.ok === true) {
          dispatch({
            type: 'DELETE_IMAGE_SUCCESS',
            payload: { type, id, imgId }
          });
        }
      })
      .catch(error => {
        dispatch({
          type: 'DELETE_IMAGE_ERROR',
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
