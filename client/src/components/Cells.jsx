import React from "react";
import styled from "styled-components";

const StyledCell = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 1;
  @media screen and (max-width: 768px) {
    width: 100%;
  }
`;
const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  width: 800px;
  color: #fff;
  font-weight: 700;
  background-color: ${props => props.theme.colorBackgroundSecondary};
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
      background-color: ${props => props.theme.colorHover};
    }
    &:first-of-type {
      padding: 0;
      margin-right: 18px;
    }
  }
`;
const StyledIndexRenderer = styled.div`
  @media screen and (max-width: 768px) {
    display: none;
  }
`;
const StyledLink = styled.a`
  font-weight: 700;
  @media screen and (max-width: 768px) {
    padding-left: 1rem;
  }
`;
const StyledMobileLabel = styled.div`
  display: none;
  @media screen and (max-width: 768px) {
    display: flex;
  }
`;

const HUMAN_READABLE_MAP = {
  estimated_earnings: "Earnings (30 days)",
  recorded_subs: "Rec. Subs",
  estimated_subs: "Est. Subs",
  bits: "Bits",
  bits_from_extensions: "Bits from Ext.",
  recorded_prime_subs: "Prime Subs",
  gifted_by_broadcaster_tier1_subs: "By Streamer",
  gifted_tier1_subs: "Gifted T1",
  gifted_tier2_subs: "Gifted T2",
  gifted_tier3_subs: "Gifted T3",
  recorded_tier1_subs: "T1 Subs",
  recorded_tier2_subs: "T2 Subs",
  recorded_tier3_subs: "T3 Subs",
  msgs: "Messages",
  percentage_gifted: "% Gifted",
}

export const headerRowRenderer = ({
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
export const indexRenderer = ({ rowIndex }) => {
  return (
    <StyledIndexRenderer>
      {rowIndex}
    </StyledIndexRenderer>
  )
}
export const linkRenderer = ({
  cellData,
}) => (
  <StyledLink
    href={`https://twitch.tv/${cellData}`}
    target="_blank"
    rel="noreferrer"
    as="div"
  >
    {cellData}
  </StyledLink>
);
export const moneyRenderer = ({ dataKey, cellData }) => {
  return (
    <StyledCell>
      <StyledMobileLabel>
        {HUMAN_READABLE_MAP[dataKey]}
      </StyledMobileLabel>
      ${cellData.toLocaleString()}
    </StyledCell>
  );
}
export const numberRenderer = ({
  cellData,
  dataKey,
}) => (
  <StyledCell>
    <StyledMobileLabel>
      {HUMAN_READABLE_MAP[dataKey]}
    </StyledMobileLabel>
    {cellData.toLocaleString()}
  </StyledCell>
);
