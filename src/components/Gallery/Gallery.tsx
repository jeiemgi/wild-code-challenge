import { gsap } from "@/js/gsap";
import { useEffect } from "react";
import {
  GalleryWrapper,
  GalleryContainer,
  BackgroundsContainer,
  BackgroundItem,
  SlideItem,
  TitlesContainer,
  TitleItem,
} from "@/components/Gallery/styles";
import GalleryPagination from "@/components/Gallery/GalleryPagination.tsx";
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
      {/*<Rule $color={"yellow"} className={"rule"} $center />*/}

      <BackgroundsContainer className={"gallery__backgrounds"}>
        {data.map((item, index) => (
          <BackgroundItem
            item={item}
            key={`BackgroundItem-${index}`}
            className={"slide-background-item"}
          />
        ))}
      </BackgroundsContainer>

      <GalleryWrapper className={"gallery__wrapper"}>
        {data.map((item, index) => (
          <SlideItem
            item={item}
            data-index={index}
            className={"slide-item"}
            key={`SlideItem-${index}`}
          />
        ))}
      </GalleryWrapper>

      <TitlesContainer className={"gallery__titles"}>
        {data.map((item, index) => (
          <TitleItem
            item={item}
            index={index}
            key={`Titles-${index}`}
            className={"slide-title-item"}
          />
        ))}
      </TitlesContainer>

      <GalleryPagination data={data} />
    </GalleryContainer>
  );
};

export default Gallery;
