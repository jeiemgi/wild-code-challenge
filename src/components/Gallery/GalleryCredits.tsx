import styled from "styled-components";
import { Col, Grid } from "@/components/Grid.tsx";
import { LabelSpan } from "@/components/Text.tsx";
import type { GalleryData } from "@/js/data.ts";

const Container = styled(Grid)`
  position: absolute;
  bottom: 100px;
  width: 100%;

  .credit {
    opacity: 0;
    transition: opacity 0.2s ease-out;

    &.credit--active {
      opacity: 1;
    }
  }
`;

const Button = styled.button`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: 9px 16px;
  background: #ffffff;
  border-radius: 24px;
  pointer-events: all;
`;

export const CreditsItem = ({ item }: { item: GalleryData[0] }) => {
  return (
    <Container className={"ui-initial"}>
      <Col $span={1} $start={11} className="credit">
        <LabelSpan $color={"white"} className={"pr-8"}>
          {item.subtitle}
        </LabelSpan>
        <br />
        <div className={"mb-4 text-right"}>
          <LabelSpan $color={"white"}>{item.date}</LabelSpan>
        </div>
        <Button data-hover>
          <LabelSpan>HAVE A LOOK</LabelSpan>
        </Button>
      </Col>
    </Container>
  );
};
