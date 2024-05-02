import styled from "styled-components";

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
