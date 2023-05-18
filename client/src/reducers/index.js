import data from "@/reducers/data";
import ui from "@/reducers/ui";
import table from "@/reducers/table";

const reducers = {
  data,
  table,
  ui,
};

export const selectTableData = (state) => state.data.data;
export const selectDataHistory = (state) => state.data.dataHistory;
export const selectGraphKeys = (state) => state.ui.graphKeys;
export const selectSelectedStreamerForDrawer = (state) => state.ui.selectedStreamerForDrawer;
export const selectTableColumns = (state) => state.table.columns;

export default reducers;
