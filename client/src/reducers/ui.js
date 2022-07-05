import {
  SELECT_STREAMER_FOR_DRAWER,
  SET_GRAPH_KEYS,
} from 'actions/ui';
import {
  RESET_DATA_HISTORY,
} from "actions/data";
import produce from "immer";

const DEFAULT_STATE = {
  selectedStreamerForDrawer: null,
  graphKeys: [],
};

const mouseReducer = (state = DEFAULT_STATE, action) =>
  produce(state, draft => {
    switch (action.type) {
      case SELECT_STREAMER_FOR_DRAWER:
        draft.selectedStreamerForDrawer = action.streamerName;
        if (action.streamerName) {
          draft.graphKeys.push(action.streamerName);
        }
        break;
      case SET_GRAPH_KEYS:
        draft.graphKeys = action.graphKeys;
        break;
      case RESET_DATA_HISTORY:
        draft.graphKeys = [];
        draft.selectedStreamerForDrawer = null;
        break;
      default:
        break;
    }
  }
  );

export default mouseReducer;
