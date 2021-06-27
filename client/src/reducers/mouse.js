import {
  HOVER_IMAGE,
  GET_MOUSE_POSITION,
} from 'actions/mouse';
import produce from "immer";

const DEFAULT_STATE={
  content: false,
  mousePosition: {xValue: 0, yValue: 0}
};

const mouseReducer = (state = DEFAULT_STATE, action) =>
  produce(state, draft => {
    switch(action.type){
      case GET_MOUSE_POSITION:
        draft.mousePosition = {
          xValue: action.xValue,
          yValue: action.yValue,
        };
        break;
      case HOVER_IMAGE:
        draft.content = action.image;
        break;
      default:
        break;
    }
  }
);

export default mouseReducer;
