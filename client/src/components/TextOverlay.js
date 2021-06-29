import React, {
  useMemo,
} from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { hoverImage } from 'actions/mouse';
import { isEmpty, isNil, prop, sortBy } from "ramda";
import { format } from "date-fns";
import Chart from "components/Chart";

const isEmptyOrNil = isEmpty || isNil;

const StyledWrapper = styled.div`
  top: 1rem;
  right: 1rem;
  height: calc(100% - 2rem);
  position: fixed;
  background-color: #1f2937;
  color: #dedede;
  padding: 0 .8rem 2rem .8rem;
  border-radius: 3px;
  border: 2px solid #374151;
  box-sizing: border-box;
  font-family: Tahoma, Geneva, sans-serif;
  font-size: .8rem;
  white-space: nowrap;
  width: 700px;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
  @media screen and (max-width: 768px) {
    max-width: calc(100% - 2rem);
  }
  .recharts-tooltip-wrapper {
    background-color: #000;
    .customTooltip {
    background-color: #000;
    }
  }
`;
const StyledContainer = styled.div`
  flex: 1;
  overflow-y: auto;
`;
const StyledRow = styled.div`
  display: flex;
  &:nth-child(odd) {
    background-color: #374151;
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
  font-weight: 600;
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
const StyledClose = styled.div`
  left: 1rem;
  top: 1rem;
  cursor: pointer;
  svg {
    fill: #dedede;
    width: 1rem;
    height: 1rem;
  }
`;
const StyledCloseWrapper = styled.div`
  width: 100%;
  padding: 1rem 0.5rem;
  border-bottom: 2px solid #374151;
`;

const TextOverlay = ({ content, dataHistory, hoverImage }) => {
  const tableData = useMemo(() => (dataHistory[content]) ? sortBy(prop('start_of_30_day_interval'))(dataHistory[content]) : null, [dataHistory, content])
  return (
    <>
      {content &&
        <StyledWrapper>
          <StyledCloseWrapper>
            <StyledClose onClick={() => hoverImage(null)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z" /></svg>
            </StyledClose>
          </StyledCloseWrapper>
          <StyledContainer>
          {!isEmptyOrNil(tableData) ?
            <>
              <h2>
                {tableData?.[0]?.channel}
              </h2>
              <Chart />
              <StyledTableHeader>
                <div>
                  StartDate (30d)
                </div>
                <div>
                  Est. Earn (30d)
                </div>
                <div>
                  Rec. Subs
                </div>
                <div>
                  Est. Subs
                </div>
              </StyledTableHeader>
              {tableData?.map((val =>
                <StyledRow>
                  <div>
                    {format(new Date(val.start_of_30_day_interval), "PP")}
                  </div>
                  <div>
                    ${val.estimated_earnings.toLocaleString()}
                  </div>
                  <div>
                    {val.recorded_subs.toLocaleString()}
                  </div>
                  <div>
                    {val.estimated_subs.toLocaleString()}
                  </div>
                </StyledRow>))}
            </>
            :
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
          }
          </StyledContainer>
        </StyledWrapper>
      }
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    content: state.mouse.content,
    dataHistory: state.data.dataHistory,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    hoverImage: (value) => dispatch(hoverImage(value)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(TextOverlay);
