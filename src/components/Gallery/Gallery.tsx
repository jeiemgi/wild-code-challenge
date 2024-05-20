import { gsap } from "@/js/gsap";
import { Fragment, useEffect } from "react";
import styled from "styled-components";
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

const MainWrapper = styled.main`
  width: 100vw;
  height: 100vh;
  position: relative;
`;

const SliderWrapper = styled.div`
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  white-space: nowrap;
  will-change: transform;
  border: solid 1px red;
`;

export const AbsoluteContainer = styled.div`
  top: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  position: absolute;
  pointer-events: none;
  width: 100%;
  height: 100%;
`;

const Gallery = ({ id, data }: GalleryProps) => {
  useEffect(() => {
    let controller: GalleryController;
    const ctx = gsap.context(() => {
      console.log(id);
      controller = new GalleryController(id, data);
      controller.setup();
      // controller.addListeners();
      //this.initialAnimation();
    });

    return () => {
      ctx.revert();
      controller?.removeListeners();
    };
  }, [id, data]);

  return (
    <MainWrapper id={id} className={"gallery__container"}>
      <SliderWrapper className={"gallery__scroller"}>
        {data.map((item, index) => (
          <SlideItem item={item} key={`SlideItem-${index}`} />
        ))}
      </SliderWrapper>

      <BackgroundsContainer className={"gallery__backgrounds"}>
        {data.map((item, index) => (
          <BackgroundItem key={`BackgroundItem-${index}`} item={item} />
        ))}
      </BackgroundsContainer>

      <AbsoluteContainer className={"gallery__titles"}>
        {data.map((item, index) => (
          <Fragment key={`Titles-${index}`}>
            <TitleItem item={item} index={index} />
            <CreditsItem item={item} key={`Credits-${index}`} />
          </Fragment>
        ))}
      </AbsoluteContainer>

      {/*<GalleryPagination data={data} />*/}
    </MainWrapper>
  );
};

export default Gallery;
