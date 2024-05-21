import { SplitText } from "@/js/gsap.ts";

export const clamp = (num: number, min: number, max: number) =>
  Math.min(Math.max(num, min), max);

export const getImageMeasures = (
  target:
    | {
        width: number;
        height: number;
      }
    | HTMLDivElement,
  position = -1,
) => {
  let posX = 0;
  let posY = 0;

  const width =
    target instanceof HTMLDivElement ? target.clientWidth : target.width;
  const height =
    target instanceof HTMLDivElement ? target.clientHeight : target.height;

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
    x: posX,
    y: posY,
    width: imageW,
    height: imageH,
  };
};

export const getHiddenMeasures = () => {
  return {
    x: 16,
    y: 16,
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
