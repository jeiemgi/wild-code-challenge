import styled from "styled-components";
import type { GalleryData } from "@/js/data.ts";

export const BackgroundsContainer = styled.div`
  top: 0;
  left: 0;
  opacity: 0;
  width: 100%;
  height: 100%;
  display: flex;
  position: absolute;
  background-size: cover;
  background-position: center;
  align-items: center;
  transform: scale(2);
`;

const BackgroundStyle = styled.div`
  top: 0;
  left: 0;
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  background-size: cover;
  background-position: center;
  transform: scale(2);
`;

export function BackgroundItem({ item }: { item: GalleryData[0] }) {
  return (
    <BackgroundStyle style={{ backgroundImage: `url(${item.background})` }} />
  );
}
