import { DataType } from "@/js/data.ts";

function GalleryTitles({ data }: { data: DataType }) {
  return (
    <div
      className={
        "pointer-events-none fixed left-0 top-0 size-full items-center justify-center"
      }
    >
      <div className={"relative mx-auto flex h-full w-[54%] items-center"}>
        {data.map((item, index) => {
          return (
            <div
              key={`GalleryTitle-${index}`}
              className={"gallery-title absolute w-full"}
            >
              <h1
                className={
                  "heading--1 text-outline pointer-events-auto text-center"
                }
              >
                {item.title}
              </h1>
              <div
                className={
                  "clip-text pointer-events-none absolute left-0 top-0 size-full"
                }
              >
                <h1
                  key={`GalleryTitle-${index}`}
                  className={"heading--1 text-center"}
                >
                  {item.title}
                </h1>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default GalleryTitles;
