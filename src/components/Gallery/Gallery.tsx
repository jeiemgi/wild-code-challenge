import styled from "styled-components";
import { useEffect } from "react";
import { gsap } from "@/js/gsap";
import GalleryTitles from "@/components/Gallery/GalleryTitles.tsx";
import GallerySlides from "@/components/Gallery/GallerySlides.tsx";
import GalleryBackground from "@/components/Gallery/GalleryBackground.tsx";
import type { DataType } from "@/js/data.ts";
import { GalleryController } from "@/js/GalleryController.ts";
import GalleryUI from "@/components/Gallery/GalleryUI.tsx";

const Wrapper = styled.main`
  width: 100vw;
  height: 100vh;
  background: black;
  overflow: hidden;
`;

interface Props {
  data: DataType;
}

function Gallery({ data }: Props) {
  useEffect(() => {
    let controller: GalleryController;

    const ctx = gsap.context(() => {
      controller = new GalleryController("#gallery-home", data);
    });

    return () => {
      ctx.revert();
      controller?.cleanup();
    };
  }, [data]);

  return (
    <Wrapper id={"gallery-home"}>
      <GalleryBackground data={data} />
      <GallerySlides data={data} />
      <GalleryTitles data={data} />
      <GalleryUI />
    </Wrapper>
  );
}

export default Gallery;
