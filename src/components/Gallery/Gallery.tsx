import { gsap } from "@/js/gsap";
import { useEffect } from "react";
import { Rule } from "@/components/Grid.tsx";
import {
  GalleryWrapper,
  GalleryContainer,
  BackgroundsContainer,
  BackgroundItem,
  SlideItem,
  TitlesContainer,
  TitleItem,
} from "@/components/Gallery/styles";
import GalleryController from "@/js/controllers/GalleryController.ts";
import type { GalleryData } from "@/js/data.ts";

interface GalleryProps {
  id: string;
  data: GalleryData;
}

const Gallery = ({ id, data }: GalleryProps) => {
  useEffect(() => {
    let controller: GalleryController;
    const ctx = gsap.context(() => {
      controller = new GalleryController(id, data, {
        centered: true,
        slidesPerView: 1,
        breakpoints: {
          1200: {
            centered: true,
            slidesPerView: 3,
          },
        },
      });

      controller.setup();
      controller.initialAnimation();
    });

    return () => {
      ctx.revert();
      controller?.removeListeners();
    };
  }, [id, data]);

  return (
    <GalleryContainer id={id} className={"gallery__container"}>
      <Rule $color={"yellow"} className={"rule"} $center />
      <BackgroundsContainer className={"gallery__backgrounds"}>
        {data.map((item, index) => (
          <BackgroundItem
            className={"gallery__background__item"}
            key={`BackgroundItem-${index}`}
            item={item}
          />
        ))}
      </BackgroundsContainer>

      <GalleryWrapper className={"gallery__wrapper"}>
        {data.map((item, index) => (
          <SlideItem item={item} key={`SlideItem-${index}`} />
        ))}
      </GalleryWrapper>

      <TitlesContainer className={"gallery__titles"}>
        {data.map((item, index) => (
          <TitleItem item={item} index={index} key={`Titles-${index}`} />
        ))}
      </TitlesContainer>

      {/*<GalleryPagination data={data} />*/}
    </GalleryContainer>
  );
};

export default Gallery;
