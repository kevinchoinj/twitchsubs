import { FETCH_DATA_SUCCEEDED, FETCH_DATA_HISTORY_SUCCEEDED, RESET_DATA_HISTORY } from "actions/data";
import { assoc } from "ramda";

const DEFAULT_STATE = {
  data: 0,
  dataHistory: {},
};

const dataReducer = (state = DEFAULT_STATE, payload) => {
  switch (payload.type) {
    case FETCH_DATA_SUCCEEDED:
      return (state = {
        ...state,
        data: payload?.data?.map((data) => {
          if (data.recorded_subs) {
            data.percentage_gifted =
              ((data.gifted_tier1_subs + data.gifted_tier2_subs + data.gifted_tier3_subs) / data.estimated_subs) * 100;
          } else {
            data.percentage_gifted = 0;
          }
          data.bits = data.bits + data.bits_from_extensions;
          return data;
        }),
      });

    case FETCH_DATA_HISTORY_SUCCEEDED:
      return (state = {
        ...state,
        dataHistory: assoc(
          payload.username,
          payload?.data?.map((data) => {
            if (data.recorded_subs) {
              data.percentage_gifted =
                ((data.gifted_tier1_subs + data.gifted_tier2_subs + data.gifted_tier3_subs) / data.estimated_subs) *
                100;
            } else {
              data.percentage_gifted = 0;
            }
            data.bits = data.bits + data.bits_from_extensions;
            return data;
          }),
          state.dataHistory
        ),
      });
    case RESET_DATA_HISTORY:
      return (state = {
        ...state,
        dataHistory: {},
      });
    default:
      return state;
  }
};

export default dataReducer;
