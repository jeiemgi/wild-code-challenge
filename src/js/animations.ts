import { gsap, ScrollTrigger } from "@/js/gsap";

const getChars = (title: HTMLDivElement) => {
  return [
    [...title.querySelectorAll(".outline > .line")],
    [...title.querySelectorAll(".fill > .line")],
  ];
};

export const scrollIn: GSAPTweenVars["scrollTrigger"] = {
  start: "left center",
  end: "center center",
};

export const scrollOut: GSAPTweenVars["scrollTrigger"] = {
  scrub: true,
  start: "center center",
  end: "right center",
};

export const triggerStart = {
  start: "50% center",
  end: "149.9% center",
};

export const triggerEnd = {
  start: "-50% center",
  end: "49.9% center",
};

export const scrollTriggerInterpolation = ({
  element,
  fromVars,
  toVars,
  ...scrollTriggerProps
}: {
  element: Element;
  fromVars: GSAPTweenVars;
  toVars: GSAPTweenVars;
} & ScrollTrigger["vars"]) => {
  const interp = gsap.utils.interpolate([fromVars, toVars]);
  ScrollTrigger.create({
    ...scrollTriggerProps,
    onUpdate: (self) => {
      gsap.set(element, interp(self.progress));
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

export const animateTextIn = (title: HTMLDivElement) => {
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
  };

  const lines = title.querySelectorAll(".outline > .line");
  const wrapsLines = title.querySelectorAll(".fill > .line");

  lines.forEach((wrap) => {
    const chars = wrap.querySelectorAll(".char-wrap");
    gsap.to(chars, toVars);
  });

  wrapsLines.forEach((wrap) => {
    const chars = wrap.querySelectorAll(".char-wrap");
    gsap.to(chars, toVars);
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
