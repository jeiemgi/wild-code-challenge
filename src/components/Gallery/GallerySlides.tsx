import styled from "styled-components";
import type { DataType } from "@/js/data.ts";

const Slider = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  will-change: transform;
`;

const SliderWrapper = styled.div`
  top: 0;
  left: 0;
  height: 100%;
  padding: 8px;
  position: absolute;
  display: flex;
  flex-wrap: nowrap;
  will-change: transform;
`;

const SliderItem = styled.div`
  height: 100%;
  display: flex;
  position: relative;
  align-items: start;
  justify-content: end;
  pointer-events: none;
  user-select: none;

  &.slide--active,
  &.slide--next,
  &.slide--prev {
    pointer-events: all;
    user-select: text;
  }
`;

const SlideItemImage = styled.div`
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

function GallerySlides({ data }: { data: DataType }) {
  return (
    <Slider className={"slider"}>
      <SliderWrapper className={"slider-wrapper"}>
        {data.map((item, index) => {
          return (
            <SliderItem
              data-index={index}
              className={"slide-item"}
              key={`Gallery-Item-${index}`}
            >
              <SlideItemImage className={"slide-img"}>
                <img
                  src={item.image}
                  alt={`Image template ${index}`}
                  className={
                    "pointer-events-none absolute left-0 top-0 size-full object-cover"
                  }
                />
              </SlideItemImage>
            </SliderItem>
          );
        })}
      </SliderWrapper>
    </Slider>
  );
}

export default GallerySlides;
