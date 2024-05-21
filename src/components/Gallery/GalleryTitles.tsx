import styled from "styled-components";
import { TitleH1 } from "@/components/Text.tsx";
import type { GalleryData } from "@/js/data.ts";

const Overlay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  overflow: hidden;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;

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
  clip-path: inset(0% 11.1% 0 11.1%);
`;

export const TitleItem = ({
  item,
  index,
  className,
}: {
  item: GalleryData[0];
  index: number;
  className: string;
}) => {
  return (
    <Overlay data-index={index} className={className}>
      <div className={"relative"}>
        <TitleH1 $outline className={"outline"}>
          {item.title}
        </TitleH1>

        <FillClip>
          <TitleH1 className={"fill"}>{item.title}</TitleH1>
        </FillClip>
      </div>
    </Overlay>
  );
};
