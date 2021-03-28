import data from 'reducers/data';

const reducers={
  data,
};

export const selectTableData = (state) => state.data.data;

export default reducers;
