import data from "reducers/data";
import ui from "reducers/ui";

const reducers = {
  data,
  ui,
};

export const selectTableData = (state) => state.data.data;
export const selectDataHistory = (state) => state.data.dataHistory;
export const selectGraphKeys = (state) => state.ui.graphKeys;
export const selectSelectedStreamerForDrawer = (state) => state.ui.selectedStreamerForDrawer;

export default reducers;
