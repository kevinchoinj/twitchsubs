import {
  FETCH_DATA_SUCCEEDED,
} from 'actions/data';

const DEFAULT_STATE={
  data: 0,
};

export default(state=DEFAULT_STATE, payload)=>
{
  switch(payload.type){
  case FETCH_DATA_SUCCEEDED:
    return state = {
      ...state,
      data: payload.data
    };
  default:
    return state;
  }
};
