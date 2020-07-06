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
      data: payload?.data?.map((data) => {
        if (data.subs) {
          data.percentage_gifted = ((data.gifted_tier1_subs + data.gifted_tier2_subs + data.gifted_tier3_subs)/data.subs)*100;
        }
        else {
          data.percentage_gifted = 0;
        }
        data.bits = data.bits + data.bits_from_extensions;
        return data;
      })
    };
  default:
    return state;
  }
};
