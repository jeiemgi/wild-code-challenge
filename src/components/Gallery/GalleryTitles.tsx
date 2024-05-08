import { DataType } from "@/js/data.ts";
import { TitleH1 } from "@/components/Text";
import styled from "styled-components";

const TitlesContainer = styled.div`
  top: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  position: fixed;
  pointer-events: none;
  width: 100%;
  height: 100%;
`;

const Overlay = styled.div`
  top: 0;
  left: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  pointer-events: none;

  &.gallery-title {
    pointer-events: none;
  }
`;

const Container = styled.div`
  width: 100%;
  position: relative;
`;

const FillClip = styled.span`
  width: 100%;
  height: 100%;
  margin: 0 auto;
  top: 0;
  left: 0;
  right: 0;
  position: absolute;
  pointer-events: none;
  background-clip: text;
  -webkit-background-clip: text;
  clip-path: inset(0% 32.8% 0 33.9%);
`;

function GalleryTitles({ data }: { data: DataType }) {
  return (
    <TitlesContainer className={"titles"}>
      {data.map((item, index) => {
        return (
          <Overlay
            data-index={index}
            key={`GalleryTitle-${index}`}
            className={"gallery-title"}
          >
            <Container className="relative">
              <TitleH1 $outline className={"outline"}>
                {item.title}
              </TitleH1>
              <FillClip>
                <TitleH1 className={"fill"}>{item.title}</TitleH1>
              </FillClip>
            </Container>
          </Overlay>
        );
      })}
    </TitlesContainer>
  );
}

export default GalleryTitles;
