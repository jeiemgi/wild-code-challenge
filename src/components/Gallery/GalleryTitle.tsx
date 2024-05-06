import { DataType } from "@/js/data.ts";
import { Grid } from "@/components/Grid.tsx";
import styled, { css } from "styled-components";

const TitleH1 = styled.h1<{ $outline?: boolean }>`
  font-family: "Tungsten", serif;
  font-style: normal;
  font-weight: 400;
  font-size: 13.75rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  text-align: center;

  font-kerning: none;
  -webkit-text-rendering: optimizeSpeed;
  text-rendering: optimizeSpeed;
  -webkit-transform: translateZ(0);
  transform: translateZ(0);

  ${(props) => {
    if (props.$outline) {
      return css`
        color: transparent;
        -webkit-text-stroke-width: 1px;
        -webkit-text-stroke-color: white;
      `;
    }
  }}
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
  clip-path: inset(0% 15.4% 0% 18.3%);
`;

const GalleryTitleDiv = styled(Grid)`
  height: 100%;
  align-items: center;
  justify-content: center;
  position: relative;
`;

function GalleryTitle({ item }: { item: DataType[0] }) {
  return (
    <GalleryTitleDiv className={"gallery-title"}>
      <div className={"relative col-span-6 col-start-4"}>
        <TitleH1 $outline>{item.title}</TitleH1>
        <TitleClip>
          <TitleH1>{item.title}</TitleH1>
        </TitleClip>
      </div>
    </GalleryTitleDiv>
  );
}

export default GalleryTitle;
