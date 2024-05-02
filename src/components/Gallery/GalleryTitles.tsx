import { DataType } from "@/js/data.ts";
import { Grid } from "@/components/Grid.tsx";

function GalleryTitles({ data }: { data: DataType }) {
  return (
    <Grid
      className={"fixed left-0 top-0 size-full items-center justify-center"}
    >
      <div
        className={"relative col-span-6 col-start-4 flex h-full items-center"}
      >
        {data.map((item, index) => {
          return (
            <div className={"gallery-title absolute w-full"}>
              <h1
                key={`GalleryTitle-${index}`}
                className={
                  "heading--1 text-outline text-center text-transparent"
                }
              >
                {item.title}
              </h1>
            </div>
          );
        })}
      </div>
    </Grid>
  );
}

export default GalleryTitles;
