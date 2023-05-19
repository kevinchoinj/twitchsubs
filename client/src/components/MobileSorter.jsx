import React from "react";
import styled from "styled-components";
import SvgIcon from "@/components/SvgIcon";

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

const mobileSorters = [
  {key: "channel", label: "Name"},
  {key: "estimated_earnings", label: "Est. Earnings (30d)"},
  {key: "estimated_subs", label: "Est. Subs"},
  {key: "percentage_gifted", label: "% Gifted"},
];

const MobileSorter = ({reversed, setReversed, setSorter, sorter}) => {
  return (
    <>
      <StyledMobileSorter>
        <strong>Sort By</strong>
      </StyledMobileSorter>
      {mobileSorters.map((value) => {
        return (
          <StyledMobileSorter key={value.key}>
            <div onClick={() => {
              if (sorter === value.key) {
                setReversed(prev => !prev);
              }
              else {
                setSorter(value.key);
              }
            }}>
              {value.label}
              {value.key === sorter && !reversed ?
                <SvgIcon name="caret-up"/>
              :
              value.key === sorter && reversed ?
                <SvgIcon name="caret-down"/> : null}
            </div>
          </StyledMobileSorter>
        );
      })}
      <StyledMobileSpace/>
    </>
  );
};

export default MobileSorter;
