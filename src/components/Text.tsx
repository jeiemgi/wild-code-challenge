import styled, { css } from "styled-components";

export const TitleH1 = styled.h1<{ $outline?: boolean }>`
  font-family: "Tungsten", serif;
  font-style: normal;
  font-size: 13.75em;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  text-align: center;
  position: relative;
  line-height: 0.68em;
  user-select: none;
  max-width: 1200px;
  margin: 0 auto;

  .word {
    padding-top: 0.04em;
    line-height: 0.8em;
  }

  /**
  Fixes of spacing were needed, 
  the font has a weird behavior on the line-height.
   */
  .char-wrap {
    opacity: 0;
    overflow: hidden;
    line-height: 0.68em;
    padding-top: 0.09em;
    margin-top: -0.045em;
    will-change: transform;
  }

  .char {
    line-height: 0.68em;
    padding-top: 0.09em;
    margin-top: -0.045em;
  }

  .char,
  .word,
  .line {
    opacity: 1;
    overflow: hidden;
  }

  ${(props) => {
    if (props.$outline) {
      return css`
        color: transparent;
        -webkit-text-stroke-width: 1px;
        -webkit-text-stroke-color: rgba(2255, 255, 255, 1);
      `;
    } else {
      return css`
        color: rgba(255, 255, 255, 1);
        .char-wrap {
          -webkit-text-stroke-width: 0;
        }
      `;
    }
  }}
`;

export const LabelSpan = styled.span<{ $color?: string; $large?: boolean }>`
  color: ${(props) => props.$color};
  font-family: "Helvetica", sans-serif;
  font-size: ${(props) => (props.$large ? "20px" : "10px")};
  font-weight: 400;
  letter-spacing: 0.02em;
  line-height: 1.7em;
  display: inline-block;
`;
