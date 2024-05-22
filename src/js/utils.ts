import { gsap, SplitText } from "@/js/gsap.ts";
import { GalleryOptions } from "@/js/controllers/GalleryController.ts";

export const clamp = (num: number, min: number, max: number) =>
  Math.min(Math.max(num, min), max);

/**
 * https://gist.github.com/ca0v/73a31f57b397606c9813472f7493a940?permalink_comment_id=4941878#gistcomment-4941878
 * @param callback
 * @param delay
 */
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  callback: T,
  delay: number,
) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    return new Promise<ReturnType<T> | Error>((resolve, reject) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        try {
          const output = callback(...args);
          resolve(output);
        } catch (err) {
          if (err instanceof Error) {
            reject(err);
          }
          reject(new Error(`An error has occurred:${err}`));
        }
      }, delay);
    });
  };
}

export const getImageMeasures = (
  {
    width,
    height,
  }: {
    width: number;
    height: number;
  },
  pos = -1,
  config: GalleryOptions,
) => {
  const { imageXPercent, alignImageRight } = config;
  const widthClamp = gsap.utils.clamp(width * 0.5, width);

  const heightClamp = gsap.utils.clamp(
    window.innerHeight * 0.35,
    window.innerHeight * 0.75,
  );

  const ratio = (width * 0.5) / (height * 0.75);

  const defaultMeasures = {
    width: widthClamp(width * imageXPercent),
    height: heightClamp(height * 0.35 * ratio),
  };

  const activeMeasures = {
    width: widthClamp(width),
    height: heightClamp(height * 0.75),
  };

  const imageMeasures = pos === 0 ? activeMeasures : defaultMeasures;

  let posX = 0;
  let posY = 0;

  if (pos === 0) {
    posX = 0;
    posY = (height - imageMeasures.height) / 2;
  } else if (pos > 0) {
    posX = alignImageRight
      ? imageMeasures.width
      : width / 2 - imageMeasures.width / 2;
  } else {
    posY = height - imageMeasures.height;
  }

  return {
    x: Number(posX.toFixed(2)),
    y: Number(posY.toFixed(2)),
    ...imageMeasures,
  };
};

export const wrapChars = (split: SplitText) => {
  // We need an additional wrapper on the text to animate the content.
  return split.chars.map((char) => {
    if (char.textContent) {
      const wrap = document.createElement("div");
      wrap.append(char.textContent);
      wrap.classList.add("char-wrap");
      wrap.style.position = "relative";
      wrap.style.display = "inline-block";
      char.innerHTML = "";
      char.append(wrap);
      return wrap;
    }
  });
};

export const splitTitle = (node: Element) => {
  const split = new SplitText(node, {
    type: "words,chars,lines",
    linesClass: "line",
    wordsClass: "word",
    charsClass: "char",
    reduceWhiteSpace: true,
  });
  wrapChars(split);
};

export const querySelectorAll = <T extends HTMLDivElement>(
  el: Element | null,
  selector: string,
): NodeListOf<T> | null => {
  return el?.querySelectorAll<T>(selector) || null;
};

export const querySelector = <T extends HTMLDivElement>(
  el: Element | null,
  selector: string,
): T | null => {
  return el?.querySelector<T>(selector) || null;
};
