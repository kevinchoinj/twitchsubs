export const SELECT_STREAMER_FOR_DRAWER = Symbol('SELECT_STREAMER_FOR_DRAWER');
export const SET_GRAPH_KEYS = Symbol('SET_GRAPH_KEYS');

export const selectStreamerForDrawer = (streamerName) => {
  return {
    type: SELECT_STREAMER_FOR_DRAWER,
    streamerName,
  };
};
export const setGraphKeys = (graphKeys) => {
  return {
    type: SET_GRAPH_KEYS,
    graphKeys,
  };
};