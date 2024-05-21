import styled from "styled-components";

export * from "./GalleryTitles.tsx";
export * from "./GalleryCredits.tsx";
export * from "./GallerySlideItem.tsx";
export * from "./GalleryBackgrounds.tsx";

export const GalleryContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
`;

export const GalleryWrapper = styled.div`
  height: 100%;
  white-space: nowrap;
  border: solid 2px yellow;
`;

export const AbsoluteContainer = styled.div`
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  position: absolute;
`;

export const TitlesContainer = styled(AbsoluteContainer)`
  left: 0;
  right: 0;
  margin: 0 auto;
  pointer-events: none;
`;

export const BackgroundsContainer = styled(AbsoluteContainer)`
  opacity: 0;
  display: flex;
  align-items: center;
`;
