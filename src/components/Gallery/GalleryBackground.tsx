import styled from "styled-components";
import { DataType } from "@/js/data.ts";

const Background = styled.div`
  top: 0;
  left: 0;
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  background-size: 100%;
  background-position: center;
`;

function GalleryBackground({ data }: { data: DataType }) {
  return (
    <div className={"absolute size-full overflow-hidden"}>
      {data.map((_, index) => {
        return (
          <Background
            key={`Background-Item-${index}`}
            className={`background-item absolute size-full bg-cover bg-center opacity-0`}
            style={{
              backgroundImage: `url(${data[index].background})`,
            }}
          />
        );
      })}
    </div>
  );
}

export default GalleryBackground;
