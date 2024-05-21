import { gsap, ScrollTrigger } from "@/js/gsap";
import { getImageMeasures } from "@/js/utils.ts";

const getChars = (title: HTMLDivElement) => {
  return [
    [...title.querySelectorAll(".outline > .line")],
    [...title.querySelectorAll(".fill > .line")],
  ];
};

export const scrollIn: GSAPTweenVars["scrollTrigger"] = {
  // markers: {
  //   startColor: "green",
  //   endColor: "red",
  // },
  start: "left center",
  end: "center center",
};

export const scrollOut: GSAPTweenVars["scrollTrigger"] = {
  markers: {
    fontWeight: "bold",
    startColor: "yellow",
    endColor: "yellow",
  },
  scrub: true,
  start: "center center",
  end: "right center",
};

export const scrollTriggerInterpolate = ({
  element,
  fromPosition,
  toPosition,
  trigger,
  ...rest
}: {
  trigger: HTMLDivElement;
  element: Element;
  fromPosition: number;
  toPosition: number;
} & ScrollTrigger["vars"]) => {
  const fromMeasures = getImageMeasures(trigger, fromPosition);
  const toMeasures = getImageMeasures(trigger, toPosition);
  const interp = gsap.utils.interpolate([fromMeasures, toMeasures]);

  ScrollTrigger.create({
    trigger,
    ...rest,
    onUpdate: (self) => {
      gsap.set(element, interp(self.progress));
    },
  });
};

export const tweenImageIn = (
  trigger: HTMLDivElement,
  containerAnimation: GSAPTween,
) => {
  const slideImg = trigger.querySelector(".slide-img");
  const measures = getImageMeasures(trigger, 0);
  gsap.to(slideImg, {
    ...measures,
    duration: 0.8,
    scrollTrigger: {
      trigger,
      containerAnimation,
      ...scrollIn,
    },
  });
};

export const tweenImageOut = (
  trigger: HTMLDivElement,
  containerAnimation: GSAPTween,
) => {
  const slideImg = trigger.querySelector(".slide-img");
  const measures = getImageMeasures(trigger, -1);
  console.log(measures);
  gsap.to(slideImg, {
    ...measures,
    duration: 0.3,
    ease: "none",
    scrollTrigger: {
      trigger,
      containerAnimation,
      ...scrollOut,
    },
  });
};

export const scrollTextIn = (
  title: HTMLDivElement,
  trigger: HTMLDivElement,
  containerAnimation: GSAPTween,
) => {
  const [lines, fills] = getChars(title);

  const fromVars: GSAPTweenVars = {
    rotate: 30,
    opacity: 0,
    xPercent: 100,
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
      from: "end",
    },
    scrollTrigger: {
      trigger,
      containerAnimation,
      ...scrollIn,
    },
  };

  const allChars = title.querySelectorAll(".char-wrap");
  gsap.set(title, { clearProps: "all" });
  gsap.set(allChars, { transformOrigin: "bottom bottom" });

  lines.forEach((wrap) => {
    const chars = wrap.querySelectorAll(".char-wrap");
    gsap.fromTo(chars, fromVars, toVars);
  });

  fills.forEach((wrap) => {
    const chars = wrap.querySelectorAll(".char-wrap");
    gsap.fromTo(chars, fromVars, toVars);
  });
};

export const scrollTextOut = (
  title: HTMLDivElement,
  trigger: HTMLDivElement,
  containerAnimation: GSAPTween,
) => {
  const [lines, fills] = getChars(title);

  const toVars: GSAPTweenVars = {
    opacity: 0,
    xPercent: 100,
    rotate: 30,
    duration: 0.5,
    ease: "circ.inOut",
    stagger: {
      amount: 0.15,
      ease: "circ.in",
      from: "start",
    },
    scrollTrigger: {
      trigger,
      containerAnimation,
      ...scrollOut,
    },
  };

  lines.forEach((wrap) => {
    const chars = wrap.querySelectorAll(".char-wrap");
    gsap.to(chars, toVars);
  });

  fills.forEach((wrap) => {
    const chars = wrap.querySelectorAll(".char-wrap");
    gsap.to(chars, toVars);
  });
};

export const scrollBackgroundIn = (
  item: Element,
  trigger: HTMLDivElement,
  containerAnimation: GSAPTween,
) => {
  gsap.fromTo(
    item,
    {
      opacity: 0,
      xPercent: 50,
    },
    {
      opacity: 1,
      xPercent: 0,
      ease: "circ.out",
      scrollTrigger: {
        trigger,
        containerAnimation,
        ...scrollIn,
      },
    },
  );
};

export const scrollBackgroundOut = (
  item: Element,
  trigger: HTMLDivElement,
  containerAnimation: GSAPTween,
) => {
  gsap.to(item, {
    opacity: 0,
    xPercent: 50,
    scrollTrigger: {
      trigger,
      containerAnimation,
      ...scrollOut,
    },
  });
};

export const animateBackgroundIn = (
  bgItem: Element,
  tl: GSAPTimeline,
  position: number,
  direction: number = 1,
) => {
  const percent = 50;

  tl.fromTo(
    bgItem,
    {
      opacity: 0,
      xPercent: percent * direction,
    },
    {
      opacity: 1,
      xPercent: 0,
      ease: "circ.out",
    },
    position,
  );
};

export const animateBackgroundOut = (
  bgItem: Element,
  tl: GSAPTimeline,
  position: number,
  direction: number,
) => {
  const percent = 50;

  tl.to(
    bgItem,
    {
      opacity: 0,
      xPercent: percent * direction,
    },
    position,
  );
};

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
      transformOrigin: "bottom bottom",
    },
    0,
  );

  const lines = title.querySelectorAll(".outline > .line");
  const wrapsFill = title.querySelectorAll(".fill > .line");

  const fromVars: GSAPTweenVars = {
    opacity: 0,
    xPercent: 100 * direction,
    rotate: 30 * direction,
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
    rotate: 30 * -direction,
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
