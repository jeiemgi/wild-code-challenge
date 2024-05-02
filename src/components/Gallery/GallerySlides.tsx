import { clsx } from "clsx";
import { DataType } from "@/App.tsx";

function GallerySlides({ data }: { data: DataType }) {
  return (
    <div className={"slider relative size-full overflow-hidden"}>
      <div
        className={
          "slider-wrapper absolute left-1/3 top-0 flex h-full items-center p-4"
        }
      >
        {data.map((item, index) => {
          return (
            <div
              key={`Gallery-Item-${index}`}
              className={
                "slide-item flex size-full items-start will-change-transform"
              }
            >
              <img
                src={item.image}
                alt={`Image template ${index}`}
                className={clsx(
                  "slide-img  h-3/4 w-full origin-top-right rounded-[40px] object-cover will-change-transform",
                )}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default GallerySlides;
