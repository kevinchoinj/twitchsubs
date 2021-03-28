import React, {useCallback, useMemo, useState} from 'react';
import 'data/table.css';
import styled from 'styled-components';
import {Column, Table, AutoSizer, defaultTableRowRenderer} from 'react-virtualized';
import {assoc, filter, compose, sortBy, toLower, prop, reverse} from 'ramda';
import HeaderFilter from 'components/HeaderFilter';
import {connect} from 'react-redux';
import {
  headerRowRenderer,
  indexRenderer,
} from 'components/Cells';
import {
  HEADER_MESSAGE,
  initialColumnsVisible,
  LOADING_MESSAGE,
  visibleColumnsArray,
} from 'data/variables';
import MobileSorter from 'components/MobileSorter';
import {selectTableData} from 'reducers';

const StyledWrapper = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 1rem;
  box-sizing: border-box;
  input {
    align-self: flex-start;
    margin: 1rem 0;
  }
  font-family: 'Open Sans', helvetica, sans-serif;
`;
const StyledTableWrapper = styled.div`
  flex: 1;
`;
export const StyledRow = styled(defaultTableRowRenderer)`
  background-color: ${props => props.index % 2 === 1 ? '#1a2739' :'transparent'};
`;
const StyledLoading = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const rowRenderer = (props) => <StyledRow {...props} index={props.index}/>
const StyledNote = styled.div`
  font-size: 14px;
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const HeaderCell = ({
  dataKey,
  label,
  reversed,
  sorter,
  setReversed,
  setSorter,
}) => {
  return <div onClick={() => {
    if (sorter === dataKey) {
      setReversed(prev => !prev);
    }
    else {
      setSorter(dataKey);
    }
  }}>
    {label}
    {dataKey === sorter && !reversed ?
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 21l-12-18h24z"/></svg>
    :
    dataKey === sorter && reversed ?
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 22h-24l12-20z"/></svg> : null}
  </div>
}

const TableContainer = ({data}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sorter, setSorter] = useState('estimated_earnings');
  const [reversed, setReversed] = useState(false);
  const sorterByProp = (propName) => propName !== 'channel' ? sortBy(compose(parseInt, prop(propName))) : sortBy(compose(toLower, prop(propName)));

  const displayData = useMemo(() =>{
    return compose(
      filter(val => val?.channel?.toLowerCase().includes(searchQuery.toLowerCase())),
      sorterByProp(sorter),
    )(data)
  }
  , [sorter, data, searchQuery]);

  const reversedData = useMemo(() => {
    if (reversed && sorter === 'channel') {
      return reverse(displayData);
    }
    else if (sorter === 'channel') {
      return displayData;
    }
    else if (!reversed) {
      return reverse(displayData);
    }
    else {
      return displayData;
    }
  }, [displayData, reversed, sorter])

  const [columnsVisible, setColumnsVisible] = useState(initialColumnsVisible);
  const toggleColumn = (id, payload) => {
    setColumnsVisible(prev => assoc(id, payload, prev));
  }
  const headerFilterRenderer = () => (
    <HeaderFilter
      columnsVisible={columnsVisible}
      toggleColumn={(id, payload) => toggleColumn(id, payload)}
    />
  );

  const memoizedSetReversed = useCallback(setReversed, [setReversed]);
  const memoizedSetSorter = useCallback(setSorter, [setSorter]);

  return (
    <StyledWrapper>
      <StyledNote>
        {HEADER_MESSAGE}
      </StyledNote>
      <input
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="search"
      />
      <MobileSorter
        reversed={reversed}
        setReversed={memoizedSetReversed}
        setSorter={memoizedSetSorter}
        sorter={sorter}
      />
      <StyledTableWrapper>
        <AutoSizer>
          {({height, width}) => (
            <Table
              headerRowRenderer={headerRowRenderer}
              width={width}
              height={height}
              headerHeight={40}
              rowHeight={window.innerWidth < 768 ? visibleColumnsArray.filter(value => columnsVisible[value.dataKey]).length * 40 : 40}
              rowCount={reversedData.length}
              rowRenderer={rowRenderer}
              rowGetter={({index}) => reversedData[index]}
              columnProp={visibleColumnsArray}
            >
              <Column
                key='menu'
                headerRenderer={headerFilterRenderer}
                label='Menu'
                dataKey='menu'
                width={500}
                cellRenderer={indexRenderer}
              />
              {visibleColumnsArray.map(value => {
                return columnsVisible[value.dataKey] && (
                  <Column
                    label={value.label}
                    dataKey={value.dataKey}
                    width={2000}
                    headerRenderer={({dataKey, label}) => (
                      <HeaderCell
                        dataKey={dataKey}
                        label={label}
                        reversed={reversed}
                        setReversed={memoizedSetReversed}
                        setSorter={memoizedSetSorter}
                        sorter={sorter}
                      />
                    )}
                    cellRenderer={value.cellRenderer}
                  />
              )})}
            </Table>
          )}
        </AutoSizer>
      </StyledTableWrapper>
      {!data &&
        <StyledLoading>
          {LOADING_MESSAGE}
        </StyledLoading>
      }
    </StyledWrapper>
  );
};

const mapStateToProps = (state) => {
  return {
    data: selectTableData(state),
  };
};

export default connect(mapStateToProps, null)(TableContainer);