export const GET_MOUSE_POSITION = Symbol('GET_MOUSE_POSITION');
export const HOVER_IMAGE = Symbol('HOVER_IMAGE');
export const SET_GRAPH_KEYS = Symbol('SET_GRAPH_KEYS');

export const getMousePosition = (xValue, yValue) => {
  return{
    type: GET_MOUSE_POSITION,
    xValue: xValue,
    yValue: yValue,
  };
};
export const hoverImage = (image) => {
  return {
    type: HOVER_IMAGE,
    image,
  };
};
export const setGraphKeys = (graphKeys) => {
  return {
    type: SET_GRAPH_KEYS,
    graphKeys,
  };
};