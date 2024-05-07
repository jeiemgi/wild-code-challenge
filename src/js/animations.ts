import { gsap } from "@/js/gsap.ts";

export const animateCharsClass = ".char";

export const animateTextIn = (
  title: HTMLDivElement,
  tl: GSAPTimeline,
  position: number = 0,
) => {
  const lines = title.querySelectorAll(".line");
  const titleChars = title.querySelectorAll(animateCharsClass);
  gsap.set(titleChars, { opacity: 1 });

  lines.forEach((line) => {
    const lineChars = line.querySelectorAll(animateCharsClass);
    tl.fromTo(
      lineChars,
      {
        yPercent: 110,
        rotation: 20,
      },
      {
        yPercent: 7,
        rotation: 0,
        duration: 1.5,
        ease: "elastic.out(1, 0.8)",
        stagger: {
          amount: 0.3,
          from: "center",
        },
      },
      position,
    );
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
