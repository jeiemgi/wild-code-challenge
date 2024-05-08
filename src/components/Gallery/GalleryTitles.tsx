import { DataType } from "@/js/data.ts";
import { LabelSpan, TitleH1 } from "@/components/Text";
import styled from "styled-components";
import { Col, Grid } from "@/components/Grid.tsx";

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

const CreditsContainer = styled(Grid)`
  position: absolute;
  bottom: 100px;
  width: 100%;
  .credit {
    opacity: 0;
  }
`;

const CreditsButton = styled.button`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: 9px 16px;
  background: #ffffff;
  border-radius: 24px;
  pointer-events: all;
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

            <CreditsContainer>
              <Col $span={1} $start={11} className="credit pr-8">
                <LabelSpan $color={"white"}>{item.subtitle}</LabelSpan> <br />
                <div className={"mb-4 text-right"}>
                  <LabelSpan $color={"white"}>{item.date}</LabelSpan>
                </div>
                <CreditsButton data-hover>
                  <LabelSpan>Have a look</LabelSpan>
                </CreditsButton>
              </Col>
            </CreditsContainer>
          </Overlay>
        );
      })}
    </TitlesContainer>
  );
}

export default GalleryTitles;
