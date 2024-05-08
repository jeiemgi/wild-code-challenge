import { gsap } from "@/js/gsap";

export const animateTextIn = (
  title: HTMLDivElement,
  tl: GSAPTimeline,
  position: number = 0,
  direction: number = 1,
) => {
  const allChars = title.querySelectorAll(".char-wrap");
  tl.set([title, allChars], { opacity: 1, yPercent: 0 }, 0);

  const wraps = title.querySelectorAll(".outline > .line");
  const wrapsFill = title.querySelectorAll(".fill > .line");

  const fromVars: GSAPTweenVars = {
    rotate: 20 * direction,
    xPercent: 150 * direction,
  };

  const toVars: GSAPTweenVars = {
    rotate: 0,
    xPercent: 0,
    duration: 0.5,
    ease: "expo.out",
    stagger: {
      amount: 0.15,
      from: "center",
    },
  };

  wraps.forEach((wrap) => {
    const chars = wrap.querySelectorAll(".char-wrap");
    tl.fromTo(chars, fromVars, toVars, position);
  });

  wrapsFill.forEach((wrap) => {
    const chars = wrap.querySelectorAll(".char-wrap");
    tl.fromTo(chars, fromVars, toVars, position);
  });
};

export const animateTextOut = (title: HTMLDivElement, direction: number) => {
  gsap.to(title, {
    opacity: 0,
    yPercent: 10 * direction,
    duration: 0.2,
  });
};
