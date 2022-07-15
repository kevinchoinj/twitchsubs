import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  columns: {
    channel: true,
    estimated_earnings: true,
    recorded_subs: false,
    estimated_subs: true,
    bits: true,
    bits_from_extensions: false,
    recorded_prime_subs: true,
    gifted_by_broadcaster_tier1_subs: false,
    gifted_tier1_subs: false,
    gifted_tier2_subs: false,
    gifted_tier3_subs: false,
    recorded_tier1_subs: false,
    recorded_tier2_subs: false,
    recorded_tier3_subs: false,
    msgs: true,
    percentage_gifted: true,
  },
};

export const tableReducer = createSlice({
  name: "table",
  initialState,
  reducers: {
    setColumnVisible: (state, action) => {
      state.columns[action.payload.id] = action.payload.bool;
    },
  },
});

export const { setColumnVisible } = tableReducer.actions;

export default tableReducer.reducer;
