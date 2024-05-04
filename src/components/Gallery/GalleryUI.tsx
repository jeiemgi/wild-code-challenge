import { Grid } from "@/components/Grid.tsx";
import styled from "styled-components";

const Cursor = styled.div`
  position: fixed;
  width: 46px;
  height: 46px;
  top: -20px;
  left: -20px;
  pointer-events: none;

  &::after {
    top: 20px;
    left: 20px;
    position: absolute;
    content: "";
    width: 5px;
    height: 5px;
    display: block;
    background: white;
    border-radius: 100%;
  }

  &::before {
    top: 0;
    left: 0;
    position: absolute;
    content: "";
    width: 44px;
    height: 44px;
    display: block;
    border-radius: 100%;
    border: solid 2px rgba(255, 255, 255, 0.5);
  }

  svg {
    fill: transparent;
    stroke: white;
    stroke-width: 2;
    stroke-dasharray: 150;
    stroke-dashoffset: 150;
    transform: translateY(-2px) rotate(-90deg);
  }
`;

function GalleryUI() {
  return (
    <>
      <Cursor id="ui-cursor">
        <svg height="46" width="46" strokeLinecap={"round"}>
          <circle cx="22" cy="22" r="21" />
        </svg>
      </Cursor>

      <Grid className={"fixed left-0 top-0 z-10"}>
        <div className="relative col-span-2 flex h-full overflow-hidden rounded-md bg-white/50 shadow-2xl backdrop-blur-3xl">
          <button
            id={"button-prev"}
            className={
              "w-full border-r border-white/30 p-5 font-bold hover:bg-black hover:text-white active:bg-black active:text-white"
            }
          >
            Prev
          </button>
          <button
            id={"button-next"}
            className={
              "w-full p-5 font-bold hover:bg-black hover:text-white active:bg-black active:text-white"
            }
          >
            Next
          </button>
        </div>
      </Grid>
    </>
  );
}

export default GalleryUI;
