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
  a {
    font-weight: 700;
    text-decoration: none;
    color: #dbe2e6;
  }
  .ReactVirtualized__Table__headerRow {
    box-sizing: border-box;
    font-size: 14px;
    font-weight: 400;
    overflow: visible !important;
  }
  .ReactVirtualized__Table__Grid {
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
    &:first-of-type {
      padding: 0;
      margin-right: 18px;
    }
  }
`;

export const StyledRow = styled(defaultTableRowRenderer)`
  background-color: ${props => props.index % 2 === 1 ? '#1a2739' :'transparent'};
  @media screen and (max-width: 768px) {
    flex-direction: column;
    > div {
      width: 100%;
      display: flex;
      align-items: center;
      > div {
        padding: 0 1rem;
      }
    }
  }
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
const StyledCell = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 1;
  @media screen and (max-width: 768px) {
    width: 100%;
  }
`;
const  StyledMobileLabel = styled.div`
  display: none;
  @media screen and (max-width: 768px) {
    display: flex;
  }
`;
const StyledIndexRenderer = styled.div`
  @media screen and (max-width: 768px) {
    display: none;
  }
`;
const StyledHeaderItem = styled.div`
  @media screen and (max-width: 768px) {
    display: none !important;
  }
`;
const StyledLink = styled.a`
  @media screen and (max-width: 768px) {
    padding-left: 1rem;
  }
`;
const StyledMobileSorter= styled.div`
  display: none;
  font-size: 13px;
  svg {
    height: 10px;
    fill: #fff;
  }
  @media screen and (max-width: 768px) {
    display: flex;
  }
`;
const StyledMobileSpace = styled.div`
  display: none;
  @media screen and (max-width: 768px) {
    height: 1rem;
    display: flex;
  }
`;
const numberRenderer = ({
  cellData,
  dataKey,
}) => (
  <StyledCell>
    <StyledMobileLabel>
    {dataKey}
    </StyledMobileLabel>
    {cellData.toLocaleString()}
  </StyledCell>
);
const moneyRenderer = ({
  cellData,
  dataKey
}) => (
  <StyledCell>
    <StyledMobileLabel>
    {dataKey}
    </StyledMobileLabel>
    ${cellData.toLocaleString()}
  </StyledCell>

);
const linkRenderer = ({
  cellData,
}) => (
  <StyledLink
    href={`https://twitch.tv/${cellData}`}
    target="_blank"
    rel="noreferrer"
    >
    {cellData}
  </StyledLink>
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
    <StyledHeaderItem onClick={() => {
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
    </StyledHeaderItem>
  );

  const indexRenderer = ({rowIndex}) => {
    return (
      <StyledIndexRenderer>
        {rowIndex}
      </StyledIndexRenderer>
    )
  }

  const initialColumnsVisible = {
    channel: true,
    estimated_earnings: true,
    recorded_subs: false,
    estimated_subs: true,
    bits: true,
    bits_from_extensions: false,
    recorded_prime_subs: true,
    gifted_by_broadcaster_tier1_subs: false,
    gifted_tier1_subs: false,
    gifted_tier2_subs: false,
    gifted_tier3_subs: false,
    recorded_tier1_subs: false,
    recorded_tier2_subs: false,
    recorded_tier3_subs: false,
    msgs: true,
    percentage_gifted: true,
  };
  const visibleColumnsArray = [
    {key: 'channel', label: 'Channel'},
    {key: 'estimated_earnings', label: 'Est. Earnings'},
    {key: 'recorded_subs', label: 'Rec. Subs'},
    {key: 'estimated_subs', label: 'Est. Subs'},
    {key: 'bits', label: 'Bits'},
    {key: 'bits_from_extensions', label: 'Bits from Ext.'},
    {key: 'recorded_prime_subs', label: 'Prime Subs'},
    {key: 'gifted_by_broadcaster_tier1_subs', label: 'By Streamer'},
    {key: 'gifted_tier1_subs', label: 'Gifted T1'},
    {key: 'gifted_tier2_subs', label: 'Gifted T2'},
    {key: 'gifted_tier3_subs', label: 'Gifted T3'},
    {key: 'recorded_tier1_subs', label: 'T1 Subs'},
    {key: 'recorded_tier2_subs', label: 'T2 Subs'},
    {key: 'recorded_tier3_subs', label: 'T3 Subs'},
    {key: 'msgs', label: 'Messages'},
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
      cellRenderer: linkRenderer,
    },
    {
      display: columnsVisible.estimated_earnings,
      key: 'estimated_earnings',
      headerRender: headerRenderer,
      label: 'Earnings',
      dataKey: 'estimated_earnings',
      width: 2000,
      cellRenderer: moneyRenderer,
    },
    {
      display: columnsVisible.recorded_subs,
      key: 'recorded_subs',
      headerRender: headerRenderer,
      label: 'Rec. Subs',
      dataKey: 'recorded_subs',
      width: 2000,
      cellRenderer: numberRenderer,
    },
    {
      display: columnsVisible.estimated_subs,
      key: 'estimated_subs',
      headerRender: headerRenderer,
      label: 'Est. Subs',
      dataKey: 'estimated_subs',
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
      display: columnsVisible.recorded_prime_subs,
      key: 'recorded_prime_subs',
      headerRender: headerRenderer,
      label: 'Prime Subs',
      dataKey: 'recorded_prime_subs',
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
      display: columnsVisible.recorded_tier1_subs,
      key: 'recorded_tier1_subs',
      headerRender: headerRenderer,
      label: 'T1 Subs',
      dataKey: 'recorded_tier1_subs',
      width: 2000,
      cellRenderer: numberRenderer,
    },
    {
      display: columnsVisible.recorded_tier2_subs,
      key: 'recorded_tier2_subs',
      headerRender: headerRenderer,
      label: 'T2 Subs',
      dataKey: 'recorded_tier2_subs',
      width: 2000,
      cellRenderer: numberRenderer,
    },
    {
      display: columnsVisible.recorded_tier3_subs,
      key: 'recorded_tier3_subs',
      headerRender: headerRenderer,
      label: 'T3 Subs',
      dataKey: 'recorded_tier3_subs',
      width: 2000,
      cellRenderer: numberRenderer,
    },
    {
      display: columnsVisible.msgs,
      key: 'msgs',
      headerRender: headerRenderer,
      label: 'Messages',
      dataKey: 'msgs',
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
        Information about earnings (subscriptions/bits) from Twitch and (a few large) donations that channels have accrued over the last 30 days. All columns recording monetary value are in US dollars. In the case of multiple channels having the same donations account (e.g. main/alt channels), sum up the values. Information is refreshed every ~15 minutes.
      </StyledNote>
      <input
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="search"
      />
      <StyledTableWrapper>
      <StyledMobileSorter>
        <strong>Sort By</strong>
      </StyledMobileSorter>
      <StyledMobileSorter>
        <div onClick={() => {
          if (sorter === 'channel') {
            setReversed(prev => !prev);
          }
          else {
            setSorter('channel');
          }
        }}>
          Name
          {'channel' === sorter && !reversed ?
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 21l-12-18h24z"/></svg>
          :
          'channel' === sorter && reversed ?
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 22h-24l12-20z"/></svg> : null}
        </div>
      </StyledMobileSorter>
      <StyledMobileSorter>
        <div onClick={() => {
          if (sorter === 'estimated_earnings') {
            setReversed(prev => !prev);
          }
          else {
            setSorter('estimated_earnings');
          }
        }}>
          Estimated Earnings
          {'estimated_earnings' === sorter && !reversed ?
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 21l-12-18h24z"/></svg>
          :
          'estimated_earnings' === sorter && reversed ?
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 22h-24l12-20z"/></svg> : null}
        </div>
      </StyledMobileSorter>
      <StyledMobileSorter>
        <div onClick={() => {
          if (sorter === 'estimated_subs') {
            setReversed(prev => !prev);
          }
          else {
            setSorter('estimated_subs');
          }
        }}>
          Est. Subs
          {'estimated_subs' === sorter && !reversed ?
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 21l-12-18h24z"/></svg>
          :
          'estimated_subs' === sorter && reversed ?
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 22h-24l12-20z"/></svg> : null}
        </div>
      </StyledMobileSorter>
      <StyledMobileSorter>
        <div onClick={() => {
          if (sorter === 'percentage_gifted') {
            setReversed(prev => !prev);
          }
          else {
            setSorter('percentage_gifted');
          }
        }}>
          % Gifted
          {'percentage_gifted' === sorter && !reversed ?
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 21l-12-18h24z"/></svg>
          :
          'percentage_gifted' === sorter && reversed ?
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 22h-24l12-20z"/></svg> : null}
        </div>
      </StyledMobileSorter>
      <StyledMobileSpace/>
      <AutoSizer>
        {({height, width}) => (
          <StyledContainer>
            <Table
              headerRowRenderer={headerRowRenderer}
              width={width}
              height={height}
              headerHeight={40}
              rowHeight={window.innerWidth < 768 ? columns.filter(value => value.display).length * 40 : 40}
              rowCount={reversedData.length}
              rowRenderer={rowRenderer}
              rowGetter={({index}) => reversedData[index]}
              columnProp={columns}
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
      {!data &&
        <StyledLoading>
          Loading Data for 2000+ streamers...
        </StyledLoading>
      }
    </StyledWrapper>
  );
};

const mapStateToProps = (state) => {
  return {
    data: state.data.data,
  };
};

export default connect(mapStateToProps, null)(TableContainer);