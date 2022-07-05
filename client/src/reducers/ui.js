import { createAction, createSlice } from "@reduxjs/toolkit";

export const resetDataHistory = createAction("resetDataHistory");

const initialState = {
  selectedStreamerForDrawer: null,
  graphKeys: [],
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setStreamerForDrawer: (state, action) => {
      state.selectedStreamerForDrawer = action.payload.streamerName;
      if (action.payload.streamerName) {
        state.graphKeys.push(action.payload.streamerName);
      }
    },
    setGraphKeys: (state, action) => {
      state.graphKeys = action.payload.graphKeys;
    },
  },
  extraReducers(builder) {
    builder.addCase(resetDataHistory, (state, action) => {
      state.graphKeys = [];
      state.selectedStreamerForDrawer = null;
    });
  },
});

export const { setStreamerForDrawer, setGraphKeys } = uiSlice.actions;

export default uiSlice.reducer;
