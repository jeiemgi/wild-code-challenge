import styled from "styled-components";
import type { HTMLProps } from "react";
import type { GalleryData } from "@/js/data.ts";

const SlideItemStyle = styled.div`
  height: 100%;
  display: inline-block;
  position: relative;
  vertical-align: top;
  will-change: transform;
  pointer-events: none;
  user-select: none;

  &.slide--active,
  &.slide--next,
  &.slide--prev {
    pointer-events: all;
    user-select: text;
  }
`;

const SlideItemContent = styled.div`
  padding: 16px;
  display: flex;
  position: relative;
  pointer-events: none;
  overflow: hidden;
  transform-origin: center;
  will-change: transform;
  user-select: none;
`;

const SlideItemImg = styled.img`
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
  border: solid 1px black;
  border-radius: 10px;
  will-change: transform;
  user-select: none;
`;

export const SlideItem = ({
  item,
  ...props
}: {
  item: GalleryData[0];
} & HTMLProps<HTMLDivElement>) => {
  return (
    <SlideItemStyle data-clickable={true} {...props}>
      <SlideItemContent data-hover className={"slide-item__img"}>
        <SlideItemImg src={item.image.url} alt={item.image.alt} />
      </SlideItemContent>
    </SlideItemStyle>
  );
};
