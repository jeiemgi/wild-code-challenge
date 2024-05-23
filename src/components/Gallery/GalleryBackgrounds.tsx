import styled from "styled-components";
import type { GalleryData } from "@/js/data.ts";
import type { HTMLProps } from "react";

const BackgroundStyle = styled.div`
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  background-size: cover;
  background-position: center;
  transform: scale(1.5);
  pointer-events: none;
  opacity: 0;
`;

export function BackgroundItem({
  item,
  ...rest
}: { item: GalleryData[0] } & HTMLProps<HTMLDivElement>) {
  return (
    <BackgroundStyle
      {...rest}
      style={{ backgroundImage: `url(${item.background})` }}
    />
  );
}
