import styled from "styled-components";
import { DataType } from "@/js/data.ts";
import { LabelSpan } from "@/components/Text.tsx";

const Pagination = styled.div`
  top: 0;
  left: 0;
  right: 0;
  position: fixed;
  display: flex;
  align-items: end;
  justify-content: center;
  max-width: max-content;
  margin: 0 auto;
  bottom: 30vh;
`;

const PaginationInner = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const PaginationDotGroup = styled.div`
  display: flex;
`;

const PaginationDot = styled.button`
  padding: 0.5em;
  position: relative;
  pointer-events: all;

  .indicator {
    width: 5px;
    height: 8px;
    border-radius: 2px;
    border: solid 1px white;
    position: relative;
    overflow: hidden;
    display: block;
    pointer-events: none;

    &::before {
      top: 0;
      left: 0;
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      background: white;
      transform: translateY(100%);
      transition: transform 0.2s ease-out;
    }
  }

  &.pagination__dot--active {
    .indicator {
      &::before {
        transform: translateY(0%);
      }
    }
  }
`;

const GalleryPagination = ({ data }: { data: DataType }) => {
  return (
    <Pagination className={"pagination ui-initial"}>
      <PaginationInner>
        <LabelSpan $color={"white"} className={"labels"}>
          <span className={"pagination__number"}>1</span> of{" "}
          <span>{data.length}</span>
        </LabelSpan>
        <PaginationDotGroup>
          {data.map((_, index) => (
            <PaginationDot
              data-hover
              data-index={index}
              key={`PaginationDot-${index}`}
              className={"pagination__dot"}
            >
              <span className={"indicator"}></span>
            </PaginationDot>
          ))}
        </PaginationDotGroup>
      </PaginationInner>
    </Pagination>
  );
};

export default GalleryPagination;
