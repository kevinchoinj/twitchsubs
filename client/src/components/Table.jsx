import React, { useCallback, useMemo, useState } from "react";
import "@/data/table.css";
import styled, { keyframes, css } from "styled-components";
import { Column, Table, AutoSizer, defaultTableRowRenderer } from "react-virtualized";
import { filter, compose, sortBy, toLower, prop, reverse } from "ramda";
import HeaderFilter from "@/components/HeaderFilter";
import { useDispatch, useSelector } from "react-redux";
import { headerRowRenderer, indexRenderer } from "@/components/Cells";
import { visibleColumnsArray } from "@/data/variables";
import MobileSorter from "@/components/MobileSorter";
import { selectDataHistory, selectTableData, selectTableColumns } from "@/reducers";
import { fetchDataSingularHistory } from "@/reducers/data";
import { setStreamerForDrawer } from "@/reducers/ui";
import { setColumnVisible } from "@/reducers/table";

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
    background-color: ${(props) => props.theme.colorBackgroundSecondary};
    color: ${(props) => props.theme.colorForeground};
    border: none;
    padding: 8px 12px;
    font-size: 16px;
  }
  .ReactVirtualized__Table__row {
    cursor: pointer;
    &:hover {
      background-color: ${(props) => props.theme.colorHover};
    }
  }
`;
const StyledTableWrapper = styled.div`
  flex: 1;
`;
export const StyledRow = styled(defaultTableRowRenderer)`
  background-color: ${(props) => (props.index % 2 === 1 ? props.theme.colorBackgroundSecondary : "transparent")};
`;

const rotator = keyframes`
0% {
  transform: rotate(0deg);
}
100% {
  transform: rotate(360deg);
}
`;
const StyledLoading = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .circular_progress__object {
    animation: ${css`
        ${rotator}`} 1s ease-in-out infinite;
    stroke-dasharray: 107, 38;
    position: relative;
  }
  .circular_progress__bg {
    position: absolute;
  }
`;
export const rowRenderer = (props) => <StyledRow {...props} index={props.index} />;

const HeaderCell = ({ dataKey, label, reversed, sorter, setReversed, setSorter }) => {
  return (
    <div
      onClick={() => {
        if (sorter === dataKey) {
          setReversed((prev) => !prev);
        } else {
          setSorter(dataKey);
        }
      }}
    >
      {label}
      {dataKey === sorter && !reversed ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path d="M12 21l-12-18h24z" />
        </svg>
      ) : dataKey === sorter && reversed ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path d="M24 22h-24l12-20z" />
        </svg>
      ) : null}
    </div>
  );
};

const TableContainer = () => {
  const dispatch = useDispatch();
  const columnsVisible = useSelector(selectTableColumns);
  const data = useSelector(selectTableData);
  const dataHistory = useSelector(selectDataHistory);
  const [searchQuery, setSearchQuery] = useState("");
  const [sorter, setSorter] = useState("estimated_earnings");
  const [reversed, setReversed] = useState(false);
  const sorterByProp = (propName) =>
    propName !== "channel" ? sortBy(compose(parseInt, prop(propName))) : sortBy(compose(toLower, prop(propName)));

  const displayData = useMemo(() => {
    if (!data) {
      return [];
    }
    return compose(
      filter((val) => val?.channel?.toLowerCase().includes(searchQuery.toLowerCase())),
      sorterByProp(sorter)
    )(data);
  }, [sorter, data, searchQuery]);

  const reversedData = useMemo(() => {
    if (reversed && sorter === "channel") {
      return reverse(displayData);
    } else if (sorter === "channel") {
      return displayData;
    } else if (!reversed) {
      return reverse(displayData);
    } else {
      return displayData;
    }
  }, [displayData, reversed, sorter]);

  const toggleColumn = (id, bool) => {
    dispatch(setColumnVisible({ id: id, bool: bool }));
  };
  const headerFilterRenderer = () => (
    <HeaderFilter columnsVisible={columnsVisible} toggleColumn={(id, payload) => toggleColumn(id, payload)} />
  );

  const memoizedSetReversed = useCallback(setReversed, [setReversed]);
  const memoizedSetSorter = useCallback(setSorter, [setSorter]);

  return (
    <StyledWrapper>
      <input onChange={(e) => setSearchQuery(e.target.value)} placeholder="search" />
      <MobileSorter
        reversed={reversed}
        setReversed={memoizedSetReversed}
        setSorter={memoizedSetSorter}
        sorter={sorter}
      />
      <StyledTableWrapper>
        <AutoSizer>
          {({ height, width }) => (
            <Table
              headerRowRenderer={headerRowRenderer}
              width={width}
              height={height}
              headerHeight={40}
              rowHeight={
                window.innerWidth < 768
                  ? visibleColumnsArray.filter((value) => columnsVisible[value.dataKey]).length * 40
                  : 40
              }
              rowCount={reversedData.length}
              rowRenderer={rowRenderer}
              noRowsRenderer={() =>
                data ? (
                  <StyledLoading style={{ color: "red", fill: "red", fontWeight: "700" }}>
                    <svg
                      type="color-text-accessible-red"
                      width="20px"
                      height="20px"
                      version="1.1"
                      viewBox="0 0 20 20"
                      x="0px"
                      y="0px"
                      className="ScSvg-sc-1j5mt50-1 kJGhvW"
                    >
                      <g>
                        <path
                          fill-rule="evenodd"
                          d="M5 7a5 5 0 116.192 4.857A2 2 0 0013 13h1a3 3 0 013 3v2h-2v-2a1 1 0 00-1-1h-1a3.99 3.99 0 01-3-1.354A3.99 3.99 0 017 15H6a1 1 0 00-1 1v2H3v-2a3 3 0 013-3h1a2 2 0 001.808-1.143A5.002 5.002 0 015 7zm5 3a3 3 0 110-6 3 3 0 010 6z"
                          clip-rule="evenodd"
                        ></path>
                      </g>
                    </svg>{" "}
                    0
                  </StyledLoading>
                ) : null
              }
              rowGetter={({ index }) => reversedData[index]}
              columnProp={visibleColumnsArray}
              onRowClick={({ rowData }) => {
                if (!dataHistory[rowData.channel]) {
                  dispatch(fetchDataSingularHistory({ username: rowData.channel }));
                }
                dispatch(setStreamerForDrawer({ streamerName: rowData.channel }));
                return null;
              }}
            >
              <Column
                key="menu"
                headerRenderer={headerFilterRenderer}
                label="Menu"
                dataKey="menu"
                width={500}
                cellRenderer={indexRenderer}
              />
              {visibleColumnsArray.map((value) => {
                return (
                  columnsVisible[value.dataKey] && (
                    <Column
                      key={value.label}
                      label={value.label}
                      dataKey={value.dataKey}
                      width={2000}
                      headerRenderer={({ dataKey, label }) => (
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
                  )
                );
              })}
            </Table>
          )}
        </AutoSizer>
      </StyledTableWrapper>
      {!data && (
        <StyledLoading>
          <div>Loading Data :^)</div>
          <div>
            <svg className="circular_progress__bg" height="100" width="100">
              <circle cx="50" cy="50" r="40" stroke="#444" stroke-width="3" fill="none"></circle>
            </svg>
            <svg className="circular_progress__object" height="100" width="100">
              <circle cx="50" cy="50" r="40" stroke="#aaa" stroke-width="3" fill="none">
                <animate
                  attributeType="CSS"
                  attributeName="stroke-dasharray"
                  from="1,254"
                  to="247,56"
                  dur="5s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
          </div>
        </StyledLoading>
      )}
    </StyledWrapper>
  );
};

export default TableContainer;
