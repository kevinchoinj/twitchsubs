import React from "react";
import styled, {keyframes, css} from 'styled-components';

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
  pointer-events: ${props => props.expanded ? 'auto' : 'none'};
  user-select: ${props => props.expanded ? 'none' : 'auto'};
  display: none;
  @media screen and (max-width: 768px) {
    display: block;
  }
`;
const StyledContainer = styled.div`
  height: 100vh;
  width: 768px;
  max-width: 100%;
  display: flex;
  position: fixed;
  pointer-events: auto;
  top: 0;
  right: -100%;
  background-color :#141a23;
  transform: ${props => props.expanded && 'translateX(-100%)'};
  transition: transform .2s linear;
  animation: ${props => props.expanded && css`${animationDrawerOpen}`};
  animation-duration: .2s;
  animation-fill-mode: forward;
  animation-timing-function: linear;
  flex: 1 1 0;
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
  background-color: ${props => props.dark ? '#172330' : 'transparent'};
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
const StyledMask = styled.div`
  height: 100%;
  width: 100%;
  position: fixed;
  background-color: rgba(0,0,0,.2);
  opacity: ${props => !props.expanded ? 0 : 1};
  pointer-events: ${props => !props.expanded && 'none'};
  transition: .2s linear;
  left: 0;
  top: 0;
`;

const PanelCombined = ({children, dark, expanded, setPanel, title}) => {
  return (
    <StyledWrapper>
      <StyledMask expanded={expanded} onClick={() => setPanel(0)}/>
      <StyledContainer expanded={expanded}>
        <StyledContentContainer>
          <StyledHeader dark={dark}>
            <StyledHeaderTitle>
              {title || "sup"}
            </StyledHeaderTitle>
            <svg onClick={() => setPanel(0)} class="mdi-icon " fill="#dedede" height="24" width="24" viewBox="0 0 24 24"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"></path></svg>
          </StyledHeader>
          {children}
        </StyledContentContainer>
      </StyledContainer>
    </StyledWrapper>
  );
};

export default PanelCombined;
