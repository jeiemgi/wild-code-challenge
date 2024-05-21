import styled, { css } from "styled-components";

export const Grid = styled.div`
  width: 100%;
  display: grid;
  grid-column-gap: 1rem;
  grid-template-columns: repeat(12, 1fr);
`;

export const Col = styled.div<{ $span?: number; $start?: number }>`
  grid-column: ${(props) => `auto / span ${props.$span}` || "auto"};
  grid-column-start: ${(props) => props.$start || "auto"};
`;

export const Rule = styled.div<{
  $center?: boolean;
  $color?: string;
  $horizontal?: boolean;
  $position?: { top?: number; right?: number; bottom?: number; left?: number };
}>`
  position: fixed;
  background-color: ${(props) => props.$color};
  width: ${(props) => (props.$horizontal ? "100%" : "2px")};
  height: ${(props) => (props.$horizontal ? "2px" : "100%")};
  ${(props) => {
    if (props.$center)
      return css`
        left: 0;
        right: 0;
        margin: 0 auto;
      `;
  }}
`;

Rule.defaultProps = {
  $center: false,
  $color: "white",
  $horizontal: false,
  $position: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
};
