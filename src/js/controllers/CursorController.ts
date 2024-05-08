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
      scale: gsap.quickTo(this.DOM.el, "scale", {
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

  mouseDown = () => {
    gsap.to(this.DOM.el, { scale: 0.8 });
  };
  mouseUp = () => {
    gsap.to(this.DOM.el, { scale: 1 });
  };

  mouseEnter = () => {
    this.quickTos.opacity(1);
  };

  mouseLeave = () => {
    this.quickTos.opacity(0);
  };

  hoverIn = () => {
    gsap.to(this.DOM.el, { scale: 0.5 });
  };

  hoverOut = () => {
    gsap.to(this.DOM.el, { scale: 1 });
  };

  play = () => {
    this.timeline.pause(0);
    this.timeline.play(0);
  };

  stop = () => {
    this.timeline.pause(0);
  };

  setup = () => {
    // @ts-expect-error: Types for this function are ambiguous.
    window.addEventListener("mousemove", this.mouseMove);

    document.addEventListener("mousedown", this.mouseDown);
    document.addEventListener("mouseup", this.mouseUp);
    document.addEventListener("mouseenter", this.mouseEnter);
    document.addEventListener("mouseleave", this.mouseLeave);
  };

  cleanup = () => {
    // @ts-expect-error: Types for this function are ambiguous.
    window.removeEventListener("mousemove", this.mouseMove);
    document.removeEventListener("mousedown", this.mouseDown);
    document.removeEventListener("mouseup", this.mouseUp);
    document.removeEventListener("mouseenter", this.mouseEnter);
    document.removeEventListener("mouseleave", this.mouseLeave);
  };
}

export default CursorController;
