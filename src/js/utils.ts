import { SplitText } from "@/js/gsap.ts";

export const getColWidth = () => {
  return window.innerWidth / 12;
};
export const getMeasures = ({
  index,
  activeIndex,
  slide,
}: {
  index: number;
  activeIndex: number;
  slide: HTMLDivElement;
  slideImg: Element | null;
}) => {
  let posX = 0;
  let posY = 0;
  const margin = 16;
  const colWidth = getColWidth();
  const isActive = index === activeIndex;

  const containerW = isActive ? colWidth * 6 : colWidth * 3;
  const containerH = slide.clientHeight;

  const imageW = isActive ? colWidth * 4 : colWidth * 2;
  const imageH = isActive ? containerH * 0.75 : containerH * 0.36;

  if (index === activeIndex) {
    posX = -(containerW - imageW) / 2;
    posY = (containerH - imageH) / 2;
  } else if (index === activeIndex - 1) {
    posX = -(containerW - imageW);
    posY = containerH - imageH;
  } else if (index === activeIndex + 1) {
    posY = 0;
    posX = -margin;
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
