import React, {useState, useMemo} from 'react';
import 'react-virtualized/styles.css';
import styled from 'styled-components';
import {Column, Table, AutoSizer, defaultTableRowRenderer} from 'react-virtualized';
import {assoc, filter, compose, sortBy, toLower, prop, reverse, map} from 'ramda';
import HeaderFilter from 'components/HeaderFilter';
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
  font-family: 'Open Sans', helvetica, sans-serif;
`;
const StyledTableWrapper = styled.div`
  flex: 1;
`;
const StyledContainer = styled.div`
  .ReactVirtualized__Table__headerRow {
    box-sizing: border-box;
    font-size: 14px;
    font-weight: 400;
    overflow: visible !important;
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
    .ReactVirtualized__Table__rowColumn {
      margin-right: 0;
      padding: 0 .5rem;
    }
  }
`;
const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  width: 800px;
  color: #fff;
  background-color: #1f3041;
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
    overflow: visible;
    white-space: nowrap;
    text-overflow: ellipsis;
    height: 100%;
    cursor: pointer;
    transition: .2s ease;
    user-select: none;
  }
  .ReactVirtualized__Table__headerColumn {
    margin-right: 0;
    padding: 0 .5rem;
    &:hover {
      background-color: #304964;
    }
  }
`;

export const StyledRow = styled(defaultTableRowRenderer)`
  background-color: ${props => props.index % 2 === 1 ? '#fafafa' :'#dedede'};
  &:hover {
    background-color: #666;
    color: #fff;
  }
`;

export const rowRenderer = (props) => {
  return (
    <StyledRow {...props} index={props.index}/>
  );
};

const StyledNote = styled.div`
  font-size: 14px;
`;

const numberRenderer = ({
  cellData,
}) => (
  <>
    {cellData.toLocaleString()}
  </>
);

const TableContainer = ({data}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sorter, setSorter] = useState('channel');
  const [reversed, setReversed] = useState(false);
  const sorterByProp = (propName) => propName !== 'channel' ? sortBy(compose(parseInt, prop(propName))) : sortBy(compose(toLower, prop(propName)));

  const displayData = useMemo(() =>{
    return compose(
      filter(val => val?.channel?.toLowerCase().includes(searchQuery.toLowerCase())),
      sorterByProp(sorter),
    )(data)
    //return map((value) => assoc('percentage_gifted', 5, filteredData));
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

  const indexRenderer = ({rowIndex}) => {
    return (
      <div>
        {rowIndex}
      </div>
    )
  }

  const initialColumnsVisible = {
    channel: true,
    total_twitch_recorded_earnings: true,
    subs: true,
    bits: true,
    bits_from_extensions: false,
    prime_subs: true,
    gifted_by_broadcaster_tier1_subs: false,
    gifted_tier1_subs: false,
    gifted_tier2_subs: false,
    gifted_tier3_subs: false,
    tier1_subs: false,
    tier2_subs: false,
    tier3_subs: false,
    percentage_gifted: true,
  };
  const visibleColumnsArray = [
    {key: 'channel', label: 'Channel'},
    {key: 'total_twitch_recorded_earnings', label: 'Earnings'},
    {key: 'subs', label: 'Subs'},
    {key: 'bits', label: 'Bits'},
    {key: 'bits_from_extensions', label: 'Bits from Ext.'},
    {key: 'prime_subs', label: 'Prime Subs'},
    {key: 'gifted_by_broadcaster_tier1_subs', label: 'By Streamer'},
    {key: 'gifted_tier1_subs', label: 'Gifted T1'},
    {key: 'gifted_tier2_subs', label: 'Gifted T2'},
    {key: 'gifted_tier3_subs', label: 'Gifted T3'},
    {key: 'tier1_subs', label: 'T1 Subs'},
    {key: 'tier2_subs', label: 'T2 Subs'},
    {key: 'tier3_subs', label: 'T3 Subs'},
    {key: 'percentage_gifted', label: '% Gifted'},
  ];

  const [columnsVisible, setColumnsVisible] = useState(initialColumnsVisible);
  const toggleColumn = (id, payload) => {
    setColumnsVisible(prev => assoc(id, payload, prev));
  }
  const headerFilterRenderer = () => (
    <HeaderFilter
      visibleColumnsArray={visibleColumnsArray}
      columnsVisible={columnsVisible}
      toggleColumn={(id, payload) => toggleColumn(id, payload)}
    />
  );

  const columns = [
    {
      display: columnsVisible.channel,
      key: 'channel',
      headerRender: headerRenderer,
      label: 'Channel',
      dataKey: 'channel',
      width: 2000,
    },
    {
      display: columnsVisible.total_twitch_recorded_earnings,
      key: 'total_twitch_recorded_earnings',
      headerRender: headerRenderer,
      label: 'Earnings',
      dataKey: 'total_twitch_recorded_earnings',
      width: 2000,
      cellRenderer: numberRenderer,
    },
    {
      display: columnsVisible.subs,
      key: 'subs',
      headerRender: headerRenderer,
      label: 'Subs',
      dataKey: 'subs',
      width: 2000,
      cellRenderer: numberRenderer,
    },
    {
      display: columnsVisible.bits,
      key: 'bits',
      headerRender: headerRenderer,
      label: 'Bits',
      dataKey: 'bits',
      width: 2000,
      cellRenderer: numberRenderer,
    },
    {
      display: columnsVisible.bits_from_extensions,
      key: 'bits_from_extensions',
      headerRender: headerRenderer,
      label: 'Bits from Ext.',
      dataKey: 'bits_from_extensions',
      width: 2000,
      cellRenderer: numberRenderer,
    },
    {
      display: columnsVisible.prime_subs,
      key: 'prime_subs',
      headerRender: headerRenderer,
      label: 'Prime Subs',
      dataKey: 'prime_subs',
      width: 2000,
      cellRenderer: numberRenderer,
    },
    //hidden
    {
      display: columnsVisible.gifted_by_broadcaster_tier1_subs,
      key: 'gifted_by_broadcaster_tier1_subs',
      headerRender: headerRenderer,
      label: 'By Streamer',
      dataKey: 'gifted_by_broadcaster_tier1_subs',
      width: 2000,
      cellRenderer: numberRenderer,
    },
    {
      display: columnsVisible.gifted_tier1_subs,
      key: 'gifted_tier1_subs',
      headerRender: headerRenderer,
      label: 'Gifted T1',
      dataKey: 'gifted_tier1_subs',
      width: 2000,
      cellRenderer: numberRenderer,
    },
    {
      display: columnsVisible.gifted_tier2_subs,
      key: 'gifted_tier2_subs',
      headerRender: headerRenderer,
      label: 'Gifted T2',
      dataKey: 'gifted_tier2_subs',
      width: 2000,
      cellRenderer: numberRenderer,
    },
    {
      display: columnsVisible.gifted_tier3_subs,
      key: 'gifted_tier3_subs',
      headerRender: headerRenderer,
      label: 'Gifted T3',
      dataKey: 'gifted_tier3_subs',
      width: 2000,
      cellRenderer: numberRenderer,
    },
    {
      display: columnsVisible.tier1_subs,
      key: 'tier1_subs',
      headerRender: headerRenderer,
      label: 'T1 Subs',
      dataKey: 'tier1_subs',
      width: 2000,
      cellRenderer: numberRenderer,
    },
    {
      display: columnsVisible.tier2_subs,
      key: 'tier2_subs',
      headerRender: headerRenderer,
      label: 'T2 Subs',
      dataKey: 'tier2_subs',
      width: 2000,
      cellRenderer: numberRenderer,
    },
    {
      display: columnsVisible.tier3_subs,
      key: 'tier3_subs',
      headerRender: headerRenderer,
      label: 'T3 Subs',
      dataKey: 'tier3_subs',
      width: 2000,
      cellRenderer: numberRenderer,
    },
    {
      display: columnsVisible.percentage_gifted,
      key: 'percentage_gifted',
      headerRender: headerRenderer,
      label: '% Gifted',
      dataKey: 'percentage_gifted',
      width: 2000,
      cellRenderer: numberRenderer,
    },

  ];
  return (
    <StyledWrapper>
      <StyledNote>
        Data is from the last 30 days.
        <br/>
        <b> All columns are lower bounds: the real figure is HIGHER than what is recorded here.</b> (~+10%)
        <br/>
        Information is refreshed every 15 minutes.
        <br/>
        Earnings listed are only from subs/bits.
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
                key='menu'
                headerRenderer={headerFilterRenderer}
                label='Menu'
                dataKey='menu'
                width={500}
                cellRenderer={indexRenderer}
              />
              {columns.map(value => {
                return value.display && (
                  <Column
                    label={value.label}
                    dataKey={value.dataKey}
                    width={value.width}
                    headerRenderer={headerRenderer}
                    cellRenderer={value.cellRenderer}
                  />
              )})}
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