import styled from "styled-components";
import { TitleH1 } from "@/components/Text.tsx";
import { AbsoluteContainer } from "@/components/Gallery/styles.ts";
import type { GalleryData } from "@/js/data.ts";

const Overlay = styled.div`
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  pointer-events: none;

  &.slide-title {
    pointer-events: none;
  }
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

export const TitleItem = ({
  item,
  index,
}: {
  item: GalleryData[0];
  index: number;
}) => {
  return (
    <Overlay
      data-index={index}
      key={`GalleryTitle-${index}`}
      className={"gallery-title"}
    >
      <AbsoluteContainer className="relative">
        <TitleH1 $outline className={"outline"}>
          {item.title}
        </TitleH1>

        <FillClip>
          <TitleH1 className={"fill"}>{item.title}</TitleH1>
        </FillClip>
      </AbsoluteContainer>
    </Overlay>
  );
};
