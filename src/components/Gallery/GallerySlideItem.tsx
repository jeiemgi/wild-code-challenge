import styled from "styled-components";
import type { HTMLProps } from "react";
import type { GalleryData } from "@/js/data.ts";

const SlideItemStyle = styled.div`
  height: 100%;
  display: inline-block;
  position: relative;
  vertical-align: top;
  user-select: none;
  pointer-events: none;
  border: dashed 1px mediumpurple;
  will-change: transform;

  &.slide--active,
  &.slide--next,
  &.slide--prev {
    pointer-events: all;
    user-select: text;
  }
`;

const SlideItemContent = styled.div`
  display: flex;
  position: relative;
  border-radius: 10px;
  pointer-events: none;
  overflow: hidden;
  transform-origin: center;
  border: solid 1px black;
  will-change: transform;
`;

const SlideItemImg = styled.img`
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  object-fit: cover;
  pointer-events: none;
  will-change: transform;
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
