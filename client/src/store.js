import reducers from "./reducers/index.js";
import logger from "redux-logger";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;