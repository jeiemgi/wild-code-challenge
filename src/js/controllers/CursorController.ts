import { gsap } from "@/js/gsap.ts";
import { MouseEvent } from "react";

class CursorController {
  DOM: {
    el: HTMLDivElement | null;
    SVG: SVGElement | null;
  } = {
    el: null,
    SVG: null,
  };

  timeline: GSAPTimeline;
  quickTos;

  constructor(animationDuration: number) {
    const container = document.querySelector<HTMLDivElement>("#ui-cursor");

    this.DOM = {
      el: container,
      SVG: container?.querySelector("svg") || null,
    };

    this.quickTos = {
      opacity: gsap.quickTo(this.DOM.el, "opacity", {
        duration: 0.3,
        ease: "power4.out",
      }),
      x: gsap.quickTo(this.DOM.el, "x", {
        duration: 0.2,
        ease: "power3.out",
      }),
      y: gsap.quickTo(this.DOM.el, "y", {
        duration: 0.2,
        ease: "power3.out",
      }),
    };

    this.timeline = gsap.timeline({ paused: true });
    this.timeline.to(this.DOM.SVG, {
      ease: "none",
      strokeDashoffset: -150,
      duration: animationDuration,
    });

    this.setup();
  }

  mouseMove = (e: MouseEvent) => {
    this.quickTos.x(e.clientX, e.clientX);
    this.quickTos.y(e.clientY, e.clientY);
  };

  mouseEnter = () => {
    this.quickTos.opacity(1);
  };

  mouseLeave = () => {
    this.quickTos.opacity(0);
  };

  play = () => {
    this.timeline.restart();
    this.timeline.play(0);
  };

  reverse = () => {
    this.timeline.reverse();
  };

  setup = () => {
    // @ts-expect-error: Types for this function are ambiguous.
    window.addEventListener("mousemove", this.mouseMove);
    document.addEventListener("mouseenter", this.mouseEnter);
    document.addEventListener("mouseleave", this.mouseLeave);
  };

  cleanup = () => {
    // @ts-expect-error: Types for this function are ambiguous.
    window.removeEventListener("mousemove", this.mouseMove);
    document.removeEventListener("mouseenter", this.mouseEnter);
    document.removeEventListener("mouseleave", this.mouseLeave);
  };
}

export default CursorController;
