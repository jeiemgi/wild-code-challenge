import styled from "styled-components";

const CursorStyle = styled.div`
  position: fixed;
  width: 46px;
  height: 46px;
  top: -20px;
  left: -20px;
  opacity: 0;
  pointer-events: none;
  mix-blend-mode: difference;

  &::after {
    top: 20px;
    left: 20px;
    position: absolute;
    content: "";
    width: 4px;
    height: 4px;
    display: block;
    background: white;
    border-radius: 100%;
  }

  &::before {
    top: 0;
    left: 0;
    position: absolute;
    content: "";
    width: 44px;
    height: 44px;
    display: block;
    border-radius: 100%;
    border: solid 2px rgba(255, 255, 255, 0.1);
  }

  svg {
    fill: transparent;
    stroke: white;
    stroke-width: 2;
    stroke-dasharray: 150;
    stroke-dashoffset: 150;
    transform: translateY(-2px) rotate(-90deg);
  }
`;

const Cursor = () => {
  return (
    <CursorStyle id="ui-cursor">
      <svg height="46" width="46" strokeLinecap={"round"}>
        <circle cx="22" cy="22" r="21" />
      </svg>
    </CursorStyle>
  );
};

export default Cursor;
