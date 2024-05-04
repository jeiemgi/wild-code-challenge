import styled, { css } from "styled-components";
import { DataType } from "@/js/data.ts";

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
  clip-path: inset(0% 18.2% 0% 20.9%);
`;

function GalleryTitles({ data }: { data: DataType }) {
  return (
    <div className={"fixed left-0 top-0 size-full items-center justify-center"}>
      <div className={"relative mx-auto flex h-full w-[54%] items-center"}>
        {data.map((item, index) => {
          return (
            <div
              key={`GalleryTitle-${index}`}
              className={"gallery-title absolute w-full"}
            >
              <TitleH1 $outline>{item.title}</TitleH1>
              <TitleClip>
                <TitleH1>{item.title}</TitleH1>
              </TitleClip>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default GalleryTitles;
