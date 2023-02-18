import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { useDispatch } from "react-redux";
import { setStreamerForDrawer } from "reducers/ui";
import { useSearchParams } from "react-router-dom";
import { fetchDataSingularHistory } from "reducers/data";

const animationDrawerOpen = keyframes`
  0% {
    transform: translateX(0px);
  }
  100% {
    transform: translateX(-100%);
  }
`;
const StyledWrapper = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: ${(props) => (props.expanded ? "auto" : "none")};
  user-select: ${(props) => (props.expanded ? "none" : "auto")};
`;
const StyledContainer = styled.div`
  height: 100vh;
  width: 768px;
  max-width: 100%;
  display: flex;
  position: fixed;
  pointer-events: auto;
  top: 0;
  background-color: ${(props) => props.theme.colorBackground};
  transform: ${(props) => props.expanded && "translateX(-100%)"};
  transition: transform 0.2s linear;
  animation: ${(props) =>
    props.expanded &&
    css`
      ${animationDrawerOpen}
    `};
  animation-duration: 0.2s;
  animation-fill-mode: forward;
  animation-timing-function: linear;
  flex: 1 1 0;
  @media screen and (max-width: 768px) {
    &[style] {
      width: 100vw !important;
      right: -100vw !important;
    }
  }
`;
const StyledResizer = styled.div`
  width: 5px;
  height: 100%;
  cursor: col-resize;
  background-color: #d1d1d1;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.3s ease;
  div {
    height: 14px;
    width: 1px;
    background-color: #666;
    &:nth-child(1) {
      margin-right: 1px;
    }
  }
  &:hover {
    background-color: #666;
    div {
      background-color: #fff;
    }
  }
  &:active {
    background-color: rgb(23, 35, 48);
    div {
      background-color: #fff;
    }
  }
  @media screen and (max-width: 768px) {
    display: none;
  }
`;
const StyledContentContainer = styled.div`
  height: 100%;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
`;
const StyledHeader = styled.div`
  padding: 0 16px;
  display: flex;
  align-items: center;
  height: 55px;
  font-size: 16px;
  font-weight: 700;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
  background-color: ${(props) => props.theme.colorBackgroundSecondary};
  svg {
    fill: #dedede;
    cursor: pointer;
  }
`;
const StyledHeaderTitle = styled.div`
  display: flex;
  align-items: center;
  svg {
    fill: #dedede;
    margin: 0 10px;
  }
`;
const PanelCombined = ({ children, expanded, title }) => {
  const dispatch = useDispatch();
  const [mouseDown, setMouseDown] = useState(false);
  const [dragAmount, setDragAmount] = useState(null);
  const onMouseDown = () => {
    setMouseDown(true);
  };
  const onMouseUp = () => {
    setMouseDown(false);
  };

  const onMouseMove = (e) => {
    if (!mouseDown) {
      return;
    }
    if (e.clientX !== 0) {
      setDragAmount(e.clientX);
    }
  };
  const wrapperRef = useRef(null);

  const [searchParams] = useSearchParams();
  useEffect(() => {
    if (searchParams.get("streamer")) {
      const streamerName = searchParams.get("streamer");
      dispatch(setStreamerForDrawer({ streamerName: streamerName }));
      dispatch(fetchDataSingularHistory({ username: streamerName }));
    }
  }, [dispatch, searchParams]);
  return (
    <StyledWrapper
      expanded={mouseDown}
      ref={wrapperRef}
      onMouseMove={(e) => onMouseMove(e)}
      onMouseUp={() => onMouseUp()}
      onMouseLeave={() => onMouseUp()}
    >
      <StyledContainer
        expanded={expanded}
        style={{
          width: dragAmount ? `calc(100% - ${dragAmount}px)` : "783px",
          right: dragAmount ? `calc(-100% + ${dragAmount}px)` : "-783px",
        }}
      >
        <StyledResizer onMouseDown={() => onMouseDown()}>
          <div />
          <div />
        </StyledResizer>
        <StyledContentContainer>
          <StyledHeader>
            <StyledHeaderTitle>{title || "sup"}</StyledHeaderTitle>
            <svg
              onClick={() => dispatch(setStreamerForDrawer({ streamerName: null }))}
              className="mdi-icon "
              fill="#dedede"
              height="24"
              width="24"
              viewBox="0 0 24 24"
            >
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"></path>
            </svg>
          </StyledHeader>
          {children}
        </StyledContentContainer>
      </StyledContainer>
    </StyledWrapper>
  );
};

export default PanelCombined;
