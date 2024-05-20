import { SplitText } from "@/js/gsap.ts";

export const getColWidth = () => {
  return window.innerWidth / 12;
};
export const getMeasures = (
  index: number,
  activeIndex: number,
  slide: HTMLDivElement,
) => {
  let posX: number;
  let posY: number;
  const margin = 16;
  const colWidth = getColWidth();
  const isActive = index === activeIndex;

  const containerW = colWidth * 6;
  const containerH = slide.clientHeight;

  const imageW = isActive ? colWidth * 4 : colWidth * 2;
  const imageH = isActive ? containerH * 0.75 : containerH * 0.36;

  if (index === activeIndex) {
    posX = 0;
    posY = (containerH - imageH) / 2;
  } else if (index === activeIndex - 1) {
    posX = -(containerW - imageW);
    posY = containerH - imageH;
  } else if (index > activeIndex) {
    posY = 0;
    posX = -margin;
  } else {
    posY = containerH;
    posX = -containerW;
  }

  return {
    slide: {
      width: containerW,
    },
    image: {
      x: posX,
      y: posY,
      width: isActive ? colWidth * 4 : colWidth * 2,
      height: imageH,
    },
  };
};

export const getActiveMeasures = (slide: HTMLDivElement) => {
  const colWidth = getColWidth();
  const containerH = slide.clientHeight;
  const imageH = containerH * 0.75;
  const slideW = colWidth * 4;
  const slideH = slide.clientHeight;
  const posX = 0;
  const posY = (containerH - imageH) / 2;
  return {
    image: {
      x: posX,
      y: posY,
      width: slideW,
      height: slideH,
    },
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
