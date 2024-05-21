import { gsap, SplitText } from "@/js/gsap.ts";

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
    const p = new Promise<ReturnType<T> | Error>((resolve, reject) => {
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
    return p;
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
  position = -1,
) => {
  let posX = 0;
  let posY = 0;
  const imageW = position === 0 ? width : width / 2;
  const imageH = position === 0 ? height * 0.75 : height * 0.36;

  if (position === 0) {
    posX = 0;
    posY = (height - imageH) / 2;
  } else if (position > 0) {
    posX = imageW;
  } else {
    posY = height - imageH;
  }

  return {
    x: Number(posX.toFixed(2)),
    y: Number(posY.toFixed(2)),
    width: Number(imageW.toFixed(2)),
    height: Number(imageH.toFixed(2)),
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
