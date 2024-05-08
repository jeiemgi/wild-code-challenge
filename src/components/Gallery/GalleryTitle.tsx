import { DataType } from "@/js/data.ts";
import styled, { css } from "styled-components";

const Overlay = styled.div`
  top: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  left: -20vw;
  min-width: 90vw;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  pointer-events: none;

  &.gallery-title {
    pointer-events: none;
  }
`;

const Container = styled.div`
  width: 100%;
  position: relative;
`;

const TitleH1 = styled.h1<{ $outline?: boolean }>`
  font-family: "Tungsten", serif;
  font-style: normal;
  font-size: 13.75rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  text-align: center;
  position: relative;
  line-height: 0.68em;

  .word {
    padding-top: 0.04em;
    line-height: 0.8em;
  }

  /**
  Fixes of spacing were needed, 
  the font has a weird behavior on the line-height.
   */
  .char {
    opacity: 0;
    overflow: hidden;
    will-change: transform;
    line-height: 0.68em;
    padding-top: 0.09em;
    margin-top: -0.045em;
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
        color: white;
      `;
    }
  }}
`;

const ClipPath = styled.span`
  top: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background-clip: text;
  -webkit-background-clip: text;
  clip-path: inset(0% 31.5% 0 31.5%);
`;

function GalleryTitle({ item, ...props }: { item: DataType[0] }) {
  return (
    <Overlay className={"gallery-title"} {...props}>
      <Container className="relative">
        <TitleH1 $outline className={"outline"}>
          {item.title}
        </TitleH1>
        <ClipPath>
          <TitleH1 className={"fill"}>{item.title}</TitleH1>
        </ClipPath>
      </Container>
    </Overlay>
  );
}

export default GalleryTitle;
