import styled from "styled-components";
import { LabelSpan } from "@/components/Text.tsx";
import type { GalleryData } from "@/js/data.ts";

export const CreditItem = styled.div`
  grid-column: 1 / span 2;
  grid-column-start: 2;

  @media screen and (min-width: 900px) {
    grid-column: 1;
    grid-column-start: 11;
  }
`;

const Container = styled.div`
  left: 0;
  bottom: 32px;
  width: 100%;
  padding: 8px;
  position: absolute;
  display: grid;
  grid-column-gap: 1rem;
  grid-template-columns: repeat(4, 1fr);

  @media screen and (min-width: 900px) {
    padding: 16px;
    bottom: 100px;
    grid-column-gap: 1rem;
    grid-template-columns: repeat(12, 1fr);
  }

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

const Name = styled(LabelSpan)`
  display: block;
  text-align: center;
  padding-right: 2em;

  @media screen and (min-width: 900px) {
    text-align: left;
  }
`;

const Date = styled(LabelSpan)`
  display: block;
  text-align: center;
  margin-bottom: 2em;

  @media screen and (min-width: 900px) {
    display: block;
    text-align: right;
  }
`;

export const CreditsItem = ({ item }: { item: GalleryData[0] }) => {
  return (
    <Container className={"ui-initial"}>
      <CreditItem className="credit">
        <Name $color={"white"}>{item.subtitle}</Name>
        <Date $color={"white"}>{item.date}</Date>

        <Button data-hover>
          <LabelSpan>HAVE A LOOK</LabelSpan>
        </Button>
      </CreditItem>
    </Container>
  );
};
