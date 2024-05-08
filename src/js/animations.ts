import { gsap } from "@/js/gsap";

export const animateTextIn = (
  title: HTMLDivElement,
  tl: GSAPTimeline,
  position: number = 0,
  direction: number = 1,
) => {
  const allChars = title.querySelectorAll(".char-wrap");
  tl.set(title, { clearProps: "all" }, 0);
  tl.set(
    allChars,
    {
      rotateX: 0,
      transformOrigin: "bottom bottom",
    },
    0,
  );

  const lines = title.querySelectorAll(".outline > .line");
  const wrapsFill = title.querySelectorAll(".fill > .line");

  const fromVars: GSAPTweenVars = {
    opacity: 0,
    xPercent: 100 * direction,
    rotate: 45 * direction,
  };
  const toVars: GSAPTweenVars = {
    opacity: 1,
    xPercent: 0,
    rotate: 0,
    duration: 0.5,
    ease: "circ.inOut",
    stagger: {
      amount: 0.15,
      ease: "circ.in",
      from: direction === 1 ? "end" : "start",
    },
  };
  lines.forEach((wrap) => {
    const chars = wrap.querySelectorAll(".char-wrap");
    tl.fromTo(chars, fromVars, toVars, position + 0.07);
  });
  wrapsFill.forEach((wrap) => {
    const chars = wrap.querySelectorAll(".char-wrap");
    tl.fromTo(chars, fromVars, toVars, position + 0.07);
  });
};

export const animateTextOut = (title: HTMLDivElement, direction: number) => {
  const lines = title.querySelectorAll(".outline > .line");
  const wrapsFill = title.querySelectorAll(".fill > .line");
  const toVars: GSAPTweenVars = {
    opacity: 0,
    xPercent: 100 * -direction,
    rotate: 45 * -direction,
    duration: 0.5,
    ease: "circ.inOut",
    stagger: {
      amount: 0.15,
      ease: "circ.in",
      from: direction === 1 ? "end" : "start",
    },
  };
  lines.forEach((wrap) => {
    const chars = wrap.querySelectorAll(".char-wrap");
    gsap.to(chars, toVars);
  });
  wrapsFill.forEach((wrap) => {
    const chars = wrap.querySelectorAll(".char-wrap");
    gsap.to(chars, toVars);
  });
};
