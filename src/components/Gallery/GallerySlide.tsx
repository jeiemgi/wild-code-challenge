import styled from "styled-components";
import type { HTMLProps } from "react";
import type { GalleryData } from "@/js/data.ts";

const SlideItemStyle = styled.div`
  width: 30%;
  height: 100%;
  display: inline-block;
  position: relative;
  align-items: start;
  justify-content: end;
  pointer-events: none;
  user-select: none;
  border: solid 2px blue;

  &.slide--active,
  &.slide--next,
  &.slide--prev {
    pointer-events: all;
    user-select: text;
  }
`;

const SlideItemContent = styled.div`
  max-height: 75%;
  position: relative;
  border-radius: 10px;
  pointer-events: none;
  transform-origin: top;
  overflow: hidden;
  user-select: none;
  border: solid 1px black;
  will-change: transform;
`;

const SlideItemImg = styled.img`
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  pointer-events: none;
  object-fit: cover;
`;

export const SlideItem = ({
  item,
  ...props
}: {
  item: GalleryData[0];
} & HTMLProps<HTMLDivElement>) => {
  return (
    <SlideItemStyle className={"slide-item"} {...props}>
      <SlideItemContent data-hover className={"slide-img"}>
        <SlideItemImg src={item.image.url} alt={item.image.alt} />
      </SlideItemContent>
    </SlideItemStyle>
  );
};
