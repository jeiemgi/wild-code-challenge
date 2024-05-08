import { DataType } from "@/js/data.ts";
import styled, { css } from "styled-components";

const TitlesContainer = styled.div`
  top: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  position: fixed;
  pointer-events: none;
  width: 100%;
  height: 100%;
`;

const Overlay = styled.div`
  top: 0;
  left: 0;
  position: absolute;
  width: 100%;
  height: 100%;
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
  // font-size: 13.75em;
  font-size: 220px;
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

const FillClip = styled.span`
  width: 100%;
  height: 100%;
  margin: 0 auto;
  top: 0;
  left: 0;
  right: 0;
  position: absolute;
  pointer-events: none;
  background-clip: text;
  -webkit-background-clip: text;
  clip-path: inset(0% 32.8% 0 33.9%);
`;

function GalleryTitles({ data }: { data: DataType }) {
  return (
    <TitlesContainer className={"titles"}>
      {data.map((item, index) => {
        return (
          <Overlay
            data-index={index}
            key={`GalleryTitle-${index}`}
            className={"gallery-title"}
          >
            <Container className="relative">
              <TitleH1 $outline className={"outline"}>
                {item.title}
              </TitleH1>
              <FillClip>
                <TitleH1 className={"fill"}>{item.title}</TitleH1>
              </FillClip>
            </Container>
          </Overlay>
        );
      })}
    </TitlesContainer>
  );
}

export default GalleryTitles;
