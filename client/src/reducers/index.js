import data from 'reducers/data';
import mouse from 'reducers/mouse';

const reducers={
  data,
  mouse,
};

export const selectTableData = (state) => state.data.data;

export default reducers;
