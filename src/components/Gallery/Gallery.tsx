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
  CreditsItem,
  DraggableProxy,
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
      controller = new GalleryController(id, data);
      controller.setup();
    });
    return () => {
      ctx.revert();
      controller?.removeListeners();
    };
  }, [id, data]);

  return (
    <GalleryContainer id={id} className={"gallery__container"}>
      <DraggableProxy className="drag-proxy" />
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
            className={"slide-title-item"}
            key={`TitleItem-${index}`}
          />
        ))}
        {data.map((item, index) => (
          <CreditsItem item={item} key={`CreditsItem-${index}`} />
        ))}
      </TitlesContainer>

      <GalleryPagination data={data} />
    </GalleryContainer>
  );
};

export default Gallery;
