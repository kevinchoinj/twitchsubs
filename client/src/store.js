import reducers from "@/reducers/index.js";
import logger from "redux-logger";
import { configureStore } from "@reduxjs/toolkit";
import { loadState, saveState } from "@/localStorage";

const preloadedState = loadState();

const store = configureStore({
  reducer: reducers,
  preloadedState,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

store.subscribe(() => {
  saveState({
    table: store.getState().table,
  });
});

export default store;
