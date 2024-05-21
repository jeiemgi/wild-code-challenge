import { gsap } from "@/js/gsap";
import { Fragment, useEffect } from "react";
import styled, { css } from "styled-components";
import {
  BackgroundsContainer,
  BackgroundItem,
  CreditsItem,
  TitleItem,
  SlideItem,
} from "@/components/Gallery/styles";
import GalleryController from "@/js/controllers/GalleryController.ts";
import type { GalleryData } from "@/js/data.ts";

interface GalleryProps {
  id: string;
  data: GalleryData;
}

const Rule = styled.div<{
  $center?: boolean;
  $color?: string;
  $horizontal?: boolean;
  $position?: { top?: number; right?: number; bottom?: number; left?: number };
}>`
  position: fixed;
  background-color: ${(props) => props.$color};
  width: ${(props) => (props.$horizontal ? "100%" : "2px")};
  height: ${(props) => (props.$horizontal ? "2px" : "100%")};
  ${(props) => {
    if (props.$center)
      return css`
        left: 0;
        right: 0;
        margin: 0 auto;
      `;
  }}
`;

Rule.defaultProps = {
  $center: false,
  $color: "white",
  $horizontal: false,
  $position: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
};

const MainWrapper = styled.main`
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
`;

const SliderWrapper = styled.div`
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  will-change: transform;
  border: inset 5px red;
`;

export const AbsoluteContainer = styled.div`
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  position: absolute;
  pointer-events: none;
`;

const Gallery = ({ id, data }: GalleryProps) => {
  useEffect(() => {
    let controller: GalleryController;
    const ctx = gsap.context(() => {
      controller = new GalleryController(id, data);
      controller.setup();
      //controller.addListeners();
      //this.initialAnimation();
    });

    return () => {
      ctx.revert();
      controller?.removeListeners();
    };
  }, [id, data]);

  return (
    <MainWrapper id={id} className={"gallery__container"}>
      <Rule $center />
      {/*<BackgroundsContainer className={"gallery__backgrounds"}>
        {data.map((item, index) => (
          <BackgroundItem key={`BackgroundItem-${index}`} item={item} />
        ))}
      </BackgroundsContainer>*/}

      <SliderWrapper className={"gallery__scroller"}>
        {data.map((item, index) => (
          <SlideItem item={item} key={`SlideItem-${index}`} />
        ))}
      </SliderWrapper>

      {/*<AbsoluteContainer className={"gallery__titles"}>
        {data.map((item, index) => (
          <Fragment key={`Titles-${index}`}>
            <TitleItem item={item} index={index} />
            <CreditsItem item={item} key={`Credits-${index}`} />
          </Fragment>
        ))}
      </AbsoluteContainer>*/}

      {/*<GalleryPagination data={data} />*/}
    </MainWrapper>
  );
};

export default Gallery;
