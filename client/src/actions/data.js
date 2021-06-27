export const FETCH_DATA_STARTED = Symbol('FETCH_DATA_STARTED');
export const FETCH_DATA_SUCCEEDED = Symbol('FETCH_DATA_SUCCEEDED');
export const FETCH_DATA_FAILURE = Symbol('FETCH_DATA_FAILURE');

export const FETCH_DATA_HISTORY_STARTED = Symbol('FETCH_DATA_HISTORY_STARTED');
export const FETCH_DATA_HISTORY_SUCCEEDED = Symbol('FETCH_DATA_HISTORY_SUCCEEDED');
export const FETCH_DATA_HISTORY_FAILURE = Symbol('FETCH_DATA_HISTORY_FAILURE');

const fetchDataStarted = request => ({type: FETCH_DATA_STARTED, request});
const fetchDataSucceeded = (data) => ({type: FETCH_DATA_SUCCEEDED, data});
const fetchDataFailure = (data, error) => ({type: FETCH_DATA_FAILURE, data, error});


const fetchDataHistoryStarted = request => ({type: FETCH_DATA_HISTORY_STARTED, request});
const fetchDataHistorySucceeded = (username, data) => ({type: FETCH_DATA_HISTORY_SUCCEEDED, username, data});
const fetchDataHistoryFailure = (data, error) => ({type: FETCH_DATA_HISTORY_FAILURE, data, error});

function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

function getData() {
  return () => {
    //return fetch('https://twitch.notahoneypot.me/api/earnings_v2?current=eq.true');

    return fetch('https://twitch.notahoneypot.me/api/earnings');
  };
}
export function fetchData() {
  return (dispatch) => {
    dispatch(fetchDataStarted());
    return dispatch(getData())
      .then(handleErrors)
      .then(res => res.json())
      .then(json => {
        dispatch(fetchDataSucceeded(json));
      })
      .catch(error => dispatch(fetchDataFailure(error)));
  };
}

function getDataHistory(username) {
  return () => {
    return fetch(`https://twitch.notahoneypot.me/api/earnings_v2?start_of_30_day_interval=gt.2018-04-02T00:00:00&channel=eq.${username}`);
  };
}
export function fetchDataSingularHistory(username) {
  return (dispatch) => {
    dispatch(fetchDataHistoryStarted());
    return dispatch(getDataHistory(username))
      .then(handleErrors)
      .then(res => res.json())
      .then(json => {
        dispatch(fetchDataHistorySucceeded(username, json));
      })
      .catch(error => dispatch(fetchDataHistoryFailure(error)));
  };
}