import React, {useState, useMemo} from 'react';
import 'react-virtualized/styles.css';
import styled from 'styled-components';
import {Column, Table, AutoSizer, defaultTableRowRenderer} from 'react-virtualized';
import {filter, compose, sortBy, toLower, prop, reverse} from 'ramda';
import {connect} from 'react-redux';

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
  font-family: sans-serif;
`;
const StyledTableWrapper = styled.div`
  flex: 1;
`;
const StyledContainer = styled.div`
  .ReactVirtualized__Table__headerRow {
    box-sizing: border-box;
    font-size: 14px;
    font-weight: 400;
  }
  .ReactVirtualized__Table__Grid {
    border-left: 1px solid rgba(209, 209, 209, 1);
    border-right: 1px solid rgba(209, 209, 209, 1);
    border-bottom: 1px solid rgba(209, 209, 209, 1);
    box-sizing: border-box;
    &:focus {
      outline: none;
    }
  }
  .ReactVirtualized__Table__row {
    overflow: visible !important;
    font-size: 13px;
    box-sizing: border-box;
    .ReactVirtualized__Table__rowColumn:nth-child(1) {
      overflow: visible !important;
    }
    .ReactVirtualized__Table__rowColumn.show_overflow {
      overflow: visible !important;
    }
  }
`;
const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  width: 800px;
  color: #fff;
  background-color: #172330;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  height: 40px;
  svg {
    height: 10px;
    fill: #fff;
  }
  div {
    text-transform: capitalize;
    flex: 1;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    box-sizing: border-box;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    height: 100%;
    cursor: pointer;
    transition: .2s ease;
    user-select: none;
  }
`;

export const StyledRow = styled(defaultTableRowRenderer)`
  background-color: ${props => props.index % 2 === 1 ? '#fafafa' :'#eee'};
`;

export const rowRenderer = (props) => {
  console.log(props.index);
  return (
    <StyledRow {...props} index={props.index}/>
  );
};

const StyledNote = styled.div`
  font-size: 13px;
`;
const TableContainer = ({data}) => {

  const [searchQuery, setSearchQuery] = useState('');
  const [sorter, setSorter] = useState('channel');
  const [reversed, setReversed] = useState(false);
  const sorterByProp = (propName) => propName !== 'channel' ? sortBy(compose(parseInt, prop(propName))) : sortBy(compose(toLower, prop(propName)));

  const displayData = useMemo(() =>
    compose(
      filter(val => val?.channel?.toLowerCase().includes(searchQuery.toLowerCase())),
      sorterByProp(sorter),
    )(data)
  , [sorter, data, searchQuery]);

  const reversedData = useMemo(() => {
    if (reversed) {
      return reverse(displayData);
    }
    else {
      return displayData;
    }
  }, [displayData, reversed])

  const headerRowRenderer = ({
    className,
    columns,
    style,
  }) => (
    <StyledHeader
      className={className}
      role='row'
      style={style}
    >
      {columns}
    </StyledHeader>
  );
  const headerRenderer = ({
    dataKey,
    label,
  }) => (
    <div onClick={() => {
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
  );

  return (
    <StyledWrapper>
      <StyledNote>
        Information about earnings (subscriptions/bits) from Twitch and donations that channels have accrued over the last 30 days. All columns are lower bounds: the real figure should be at least what is recorded here.
        <br/>
        Information is refreshed every 15 minutes.
      </StyledNote>
      <input
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="search"
      />
      <StyledTableWrapper>
      <AutoSizer>
        {({height, width}) => (
          <StyledContainer>
            <Table
              headerRowRenderer={headerRowRenderer}
              width={width}
              height={height}
              headerHeight={40}
              rowHeight={40}
              rowCount={reversedData.length}
              rowRenderer={rowRenderer}
              rowGetter={({index}) => reversedData[index]}
            >
              <Column
                key='channel'
                headerRenderer={headerRenderer}
                label='Channel'
                dataKey='channel'
                width={2000}
              />
              <Column
                key='total_twitch_recorded_earnings'
                headerRenderer={headerRenderer}
                label='Earnings'
                dataKey='total_twitch_recorded_earnings'
                width={2000}
              />
              <Column
                key='subs'
                headerRenderer={headerRenderer}
                label='Total Subs'
                dataKey='subs'
                width={2000}
              />
              <Column
                key='bits'
                headerRenderer={headerRenderer}
                label='bits'
                dataKey='bits'
                width={2000}
              />
              <Column
                key='prime_subs'
                headerRenderer={headerRenderer}
                label='Prime Subs'
                dataKey='prime_subs'
                width={2000}
              />
            </Table>
          </StyledContainer>
        )}
      </AutoSizer>
      </StyledTableWrapper>
    </StyledWrapper>
  );
};

const mapStateToProps = (state) => {
  return {
    data: state.data.data,
  };
};

export default connect(mapStateToProps, null)(TableContainer);