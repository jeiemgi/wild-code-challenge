import { clsx } from "clsx";
import { DataType } from "@/js/data.ts";
import GalleryTitle from "@/components/Gallery/GalleryTitle";

function GallerySlides({ data }: { data: DataType }) {
  return (
    <div className={clsx("slider", "relative size-full overflow-hidden")}>
      <div
        className={clsx(
          "slider-wrapper",
          "absolute left-1/3 top-0 flex h-full items-center p-4 will-change-transform",
        )}
      >
        {data.map((item, index) => {
          return (
            <div
              key={`Gallery-Item-${index}`}
              className={clsx(
                "slide-item",
                "relative flex size-full items-start",
              )}
            >
              <div
                className={
                  "slide-img h-3/4 w-full origin-top-right rounded-[40px] will-change-transform"
                }
              >
                <img
                  src={item.image}
                  alt={`Image template ${index}`}
                  className={"size-full object-cover"}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="slider-titles-wrapper size-full">
        {data.map((item, index) => {
          return <GalleryTitle item={item} key={`GalleryTitle-${index}`} />;
        })}
      </div>
    </div>
  );
}

export default GallerySlides;
