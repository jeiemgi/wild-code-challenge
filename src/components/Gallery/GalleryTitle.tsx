import { DataType } from "@/js/data.ts";
import styled, { css } from "styled-components";

const TitleH1 = styled.h1<{ $outline?: boolean }>`
  font-family: "Tungsten", serif;
  font-style: normal;
  font-size: 13.75rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  text-align: center;
  display: inline !important;

  .char {
    opacity: 0;
    overflow: hidden;
    will-change: transform;
  }

  .word,
  .line {
    overflow: hidden;
  }

  ${(props) => {
    if (props.$outline) {
      return css`
        color: transparent;
        -webkit-text-stroke-width: 1px;
        -webkit-text-stroke-color: white;
      `;
    } else {
      return css`
        color: #ffffff;
      `;
    }
  }}
`;

const GalleryTitleDiv = styled.div`
  top: 0;
  left: 0;
  position: absolute;
  width: 50vw;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  &.gallery-title {
    pointer-events: none;
  }

  .word,
  .line,
  .char {
    padding-top: 0.06rem;
    line-height: 11.5rem;
    height: 11rem;
  }
`;

const TitleClip = styled.span`
  top: 0;
  left: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  color: white;
  pointer-events: none;
  background-clip: text;
  -webkit-background-clip: text;
  clip-path: inset(0% 4.4% 0 4.4%);
`;

function GalleryTitle({ item, ...props }: { item: DataType[0] }) {
  return (
    <GalleryTitleDiv className={"gallery-title"} {...props}>
      <div className="relative">
        <TitleH1 $outline>{item.title}</TitleH1>
        <TitleClip>
          <TitleH1>{item.title}</TitleH1>
        </TitleClip>
      </div>
    </GalleryTitleDiv>
  );
}

export default GalleryTitle;
