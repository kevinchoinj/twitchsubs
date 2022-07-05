import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import PanelCombined from "./PanelCombined";
import { isEmpty, isNil, prop, sortBy } from "ramda";
import { format } from "date-fns";
import Chart from "components/Chart";
import { selectSelectedStreamerForDrawer, selectDataHistory } from "reducers";

const isEmptyOrNil = isEmpty || isNil;

const StyledContent = styled.div`
  overflow-y: scroll;
  flex: 1;
  padding: 12px 16px 16px 16px;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  pre {
    background-color: #f1f3f4;
    padding: 16px;
    margin: 0;
    word-break: break-all;
    width: 100%;
    white-space: pre-wrap;
    font-size: 12px;
  }
`;
const StyledRow = styled.div`
  display: flex;
  &:nth-child(odd) {
    background-color: ${(props) => props.theme.colorBackgroundSecondary};
  }
  > div {
    flex: 0 0 25%;
    text-overflow: ellipsis;
    overflow: hidden;
    padding: 10px 4px 10px 1rem;
    @media screen and (max-width: 768px) {
      text-overflow: clip;
      padding: 10px 5px 10px 5px;
    }
  }
`;

const StyledTableHeader = styled.div`
  display: flex;
  font-weight: 700;
  background-color: ${(props) => props.theme.colorBackgroundSecondary};
  > div {
    flex: 0 0 25%;
    text-overflow: ellipsis;
    overflow: hidden;
    padding: 10px 4px 10px 1rem;
    @media screen and (max-width: 768px) {
      text-overflow: clip;
      padding: 10px 5px 10px 5px;
    }
  }
`;

const Drawer = () => {
  const content = useSelector(selectSelectedStreamerForDrawer);
  const dataHistory = useSelector(selectDataHistory);

  const tableData = useMemo(
    () => (dataHistory[content] ? sortBy(prop("start_of_30_day_interval"))(dataHistory[content]) : null),
    [dataHistory, content]
  );

  return (
    <PanelCombined expanded={content} title={content}>
      <StyledContent>
        {content && !isEmptyOrNil(tableData) ? (
          <>
            <Chart />
            <StyledTableHeader>
              <div>StartDate (30d)</div>
              <div>Est. Earn (30d)</div>
              <div>Rec. Subs</div>
              <div>Est. Subs</div>
            </StyledTableHeader>
            {tableData?.map((val) => (
              <StyledRow>
                <div>{format(new Date(val.start_of_30_day_interval), "PP")}</div>
                <div>${val.estimated_earnings.toLocaleString()}</div>
                <div>{val.recorded_subs.toLocaleString()}</div>
                <div>{val.estimated_subs.toLocaleString()}</div>
              </StyledRow>
            ))}
          </>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64px"
            height="64px"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid"
          >
            <circle
              cx="50"
              cy="50"
              fill="none"
              stroke="#dedede"
              strokeWidth="10"
              r="35"
              strokeDasharray="164.93361431346415 56.97787143782138"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                repeatCount="indefinite"
                dur="1s"
                values="0 50 50;360 50 50"
                keyTimes="0;1"
              ></animateTransform>
            </circle>
          </svg>
        )}
      </StyledContent>
    </PanelCombined>
  );
};

export default Drawer;
