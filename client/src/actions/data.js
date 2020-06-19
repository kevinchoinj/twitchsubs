export const FETCH_DATA_STARTED = Symbol('FETCH_DATA_STARTED');
export const FETCH_DATA_SUCCEEDED = Symbol('FETCH_DATA_SUCCEEDED');
export const FETCH_DATA_FAILURE = Symbol('FETCH_DATA_FAILURE');

const fetchDataStarted = request => ({type: FETCH_DATA_STARTED, request});
const fetchDataSucceeded = data => ({type: FETCH_DATA_SUCCEEDED, data});
const fetchDataFailure = (data, error) => ({type: FETCH_DATA_FAILURE, data, error});

function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

function getData() {
  return () => {
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