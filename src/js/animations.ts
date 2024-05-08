export const animateCharsClass = ".char";

export const animateTextIn = (
  title: HTMLDivElement,
  tl: GSAPTimeline,
  position: number = 0,
) => {
  const wraps = title.querySelectorAll(".outline > .line");
  const wrapsFill = title.querySelectorAll(".fill > .line");

  const fromVars: GSAPTweenVars = {
    opacity: 0,
    yPercent: 100,
  };

  const toVars: GSAPTweenVars = {
    opacity: 1,
    yPercent: 0,
    duration: 0.8,
    stagger: {
      amount: 0.2,
      from: "center",
    },
    ease: "expo.out",
  };

  wraps.forEach((wrap) => {
    const chars = wrap.querySelectorAll(".char");
    console.log(chars);
    tl.fromTo(chars, fromVars, toVars, position);
  });

  wrapsFill.forEach((wrap) => {
    const chars = wrap.querySelectorAll(".char");
    tl.fromTo(chars, fromVars, toVars, position);
  });
};

export const animateTextOut = (
  title: HTMLDivElement,
  tl: GSAPTimeline,
  position: number = 0,
) => {
  const titleLines = title.querySelectorAll(".line");

  titleLines.forEach((line) => {
    const lineChars = line.querySelectorAll(animateCharsClass);
    tl.to(
      lineChars,
      {
        yPercent: 120,
        duration: 0.3,
      },
      position,
    );
  });
};
