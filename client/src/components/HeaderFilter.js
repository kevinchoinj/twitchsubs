import React, {useState, useRef, useEffect} from 'react';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: visible !important;
  text-transform: capitalize;
  padding-left: 2px;
  svg {
    height: 16px !important;
  }
`;
const StyledLinkWrapper = styled.div`
  display: flex;
  cursor: default !important;
  flex-direction: column;
  align-items: flex-start !important;
  height: auto !important;
  top: calc(50% + 15px);
  left: calc(50% - 4px);
  box-sizing: border-box;
  position: absolute;
  border: 1px solid rgba(209, 209, 209, 1);
  z-index: 2;
  line-height: 1.4;
  padding: .5rem 1rem;
  background-color: #fff;
  color: #000;
  min-width: 200px;
  box-shadow: 0px 5px 6px 0px rgba(0,0,0,0.2);
`;
// pointer-events none on svg to prevent menu from closing when clicking checkbox itself
const StyledContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center !important;
  width: 100%;
  cursor: default !important;
  margin: 5px 0 !important;
  div {
    cursor: default !important;
    display: flex;
    align-items: center;
    overflow: hidden;
    white-space: nowrap;
  }
  svg {
    pointer-events: none;
    fill: #000 !important;
  }
  input {
    margin: 0 !important;
    height: 16px;
  }
`;

const HeaderFilter = ({
  columnsVisible,
  toggleColumn,
  visibleColumnsArray,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const closeMenu = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setShowMenu(false);
    }
  };
  const toggleMenu = (e) => {
    e.preventDefault();
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    document.addEventListener("click", closeMenu, false);
    return () => {
      document.removeEventListener("click", closeMenu, false);
    };
  }, []);

  // move ref to StyledWrapper on update to styled-components
  return (
    <StyledWrapper>
      <div ref={menuRef}
        style={{height: '100%', width: '100%', display: 'flex', justifyContent: 'center'}}
      >
<svg onClick={(e) => toggleMenu(e)} version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 512.002 512.002" xmlSpace="preserve">
<path d="M496.647,312.107l-47.061-36.8c1.459-12.844,1.459-25.812,0-38.656l47.104-36.821
	c8.827-7.109,11.186-19.575,5.568-29.419l-48.96-84.629c-5.639-9.906-17.649-14.232-28.309-10.197l-55.467,22.315
	c-10.423-7.562-21.588-14.045-33.323-19.349l-8.512-58.923c-1.535-11.312-11.24-19.72-22.656-19.627h-98.133
	c-11.321-0.068-20.948,8.246-22.528,19.456l-8.533,59.093c-11.699,5.355-22.846,11.843-33.28,19.371L86.94,75.563
	c-10.55-4.159-22.549,0.115-28.096,10.005L9.841,170.347c-5.769,9.86-3.394,22.463,5.568,29.547l47.061,36.8
	c-1.473,12.843-1.473,25.813,0,38.656l-47.104,36.8c-8.842,7.099-11.212,19.572-5.589,29.419l48.939,84.651
	c5.632,9.913,17.649,14.242,28.309,10.197l55.467-22.315c10.432,7.566,21.604,14.056,33.344,19.371l8.533,58.88
	c1.502,11.282,11.147,19.694,22.528,19.648h98.133c11.342,0.091,21-8.226,22.592-19.456l8.533-59.093
	c11.698-5.357,22.844-11.845,33.28-19.371l55.68,22.379c10.55,4.149,22.543-0.122,28.096-10.005l49.152-85.12
	C507.866,331.505,505.447,319.139,496.647,312.107z M255.964,362.667c-58.91,0-106.667-47.756-106.667-106.667
	s47.756-106.667,106.667-106.667s106.667,47.756,106.667,106.667C362.56,314.882,314.845,362.597,255.964,362.667z"/>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
        </svg>
        {showMenu &&
          <StyledLinkWrapper id="header-filter-overlay">
              {visibleColumnsArray?.map(value => (
                <StyledContainer key={value.key}>
                  <div
                    onClick={(val) => toggleColumn(value.key, val)}
                  >
                    {value.label}
                  </div>
                  <input type="checkbox"
                    name={value.key}
                    value={value.key}
                    checked={columnsVisible[value.key]}
                    onChange={(e) => toggleColumn(value.key, e.target.checked)}
                  />
                </StyledContainer>
              ))}
          </StyledLinkWrapper>
        }
      </div>
    </StyledWrapper>
  );
};

export default HeaderFilter;
