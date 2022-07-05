import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { resetDataHistory } from "reducers/ui";

const initialState = {
  data: null,
  dataLoading: false,
  dataHistory: {},
  dataHistoryLoading: false,
};

export const fetchData = createAsyncThunk("data/fetchData", async (payload, { rejectWithValue }) => {
  const response = await fetch("https://twitch.notahoneypot.me/api/earnings_v2?current=eq.true", {
    method: "GET",
  });
  if (!response.ok) {
    return rejectWithValue("rejected");
  }
  return response.json();
});

export const fetchDataSingularHistory = createAsyncThunk(
  "data/fetchDataSingularHistory",
  async (payload, { rejectWithValue }) => {
    const response = await fetch(
      `https://twitch.notahoneypot.me/api/earnings_v2?start_of_30_day_interval=gt.2018-04-02T00:00:00&channel=eq.${payload.username}`,
      {
        method: "GET",
      }
    );
    if (!response.ok) {
      return rejectWithValue("rejected");
    }
    return response.json();
  }
);

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    resetDataHistory: (state, action) => {
      state.dataHistory = {};
    },
  },
  extraReducers(builder) {
    builder
      .addCase(resetDataHistory, (state, action) => {
        state.dataHistory = {};
      })
      .addCase(fetchData.pending, (state, action) => {
        state.dataLoading = true;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.dataLoading = false;
        state.data = action.payload.map((data) => {
          if (data.recorded_subs) {
            data.percentage_gifted =
              ((data.gifted_tier1_subs + data.gifted_tier2_subs + data.gifted_tier3_subs) / data.estimated_subs) * 100;
          } else {
            data.percentage_gifted = 0;
          }
          data.bits = data.bits + data.bits_from_extensions;
          return data;
        });
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.dataLoading = false;
      })
      .addCase(fetchDataSingularHistory.pending, (state, action) => {
        state.dataHistoryLoading = true;
      })
      .addCase(fetchDataSingularHistory.fulfilled, (state, action) => {
        state.dataHistoryLoading = false;
        state.dataHistory[action.meta.arg.username] = action.payload.map((data) => {
          if (data.recorded_subs) {
            data.percentage_gifted =
              ((data.gifted_tier1_subs + data.gifted_tier2_subs + data.gifted_tier3_subs) / data.estimated_subs) * 100;
          } else {
            data.percentage_gifted = 0;
          }
          data.bits = data.bits + data.bits_from_extensions;
          return data;
        });
      })
      .addCase(fetchDataSingularHistory.rejected, (state, action) => {
        state.dataHistoryLoading = false;
      });
  },
});

export default dataSlice.reducer;
