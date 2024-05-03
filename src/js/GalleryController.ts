import { gsap, Observer, SplitText } from "@/js/gsap.ts";
import { DataType } from "@/js/data.ts";
import { MouseEvent } from "react";

const MARGIN = 16;
const slideItemClass = ".slide-item";

const getPositions = (
  idx: number,
  activeIndex: number,
  item: HTMLDivElement,
  container?: Element | null,
) => {
  let posX = 0;
  let posY = 0;

  const isActive = idx === activeIndex;
  const isPrev = idx === activeIndex - 1;

  const containerH = container ? container.clientHeight : window.innerHeight;

  if (isPrev) posX = -(item.clientWidth / 2) - MARGIN;
  if (isActive) posY = (containerH - item.clientHeight) / 2;
  else if (isPrev) posY = containerH - item.clientHeight / 2;
  else if (idx < activeIndex - 1) posY = containerH;
  else if (idx > activeIndex + 1) posY = -item.clientHeight / 2;

  return { x: posX, y: posY };
};

class Cursor {
  DOM: {
    el: HTMLDivElement | null;
    SVG: SVGElement | null;
  } = {
    el: null,
    SVG: null,
  };

  isInView = false;
  quickTos;
  timeout: number = 0;
  timeoutCallback: () => void;

  constructor(callback: () => void) {
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
    gsap.set(this.DOM.SVG, { rotate: -90, y: -2 });
    this.timeoutCallback = callback;
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

  animate = (amount = 5) => {
    clearTimeout(this.timeout);

    gsap.set(this.DOM.SVG, {
      strokeDashoffset: 0,
    });

    gsap.to(this.DOM.SVG, {
      ease: "none",
      overwrite: true,
      duration: amount,
      strokeDashoffset: -150,
    });

    this.timeout = setTimeout(() => {
      this.timeoutCallback();
    }, amount * 1000);
  };

  setup = () => {
    window.addEventListener("mousemove", this.mouseMove);
    document.addEventListener("mouseenter", this.mouseEnter);
    document.addEventListener("mouseleave", this.mouseLeave);
  };

  cleanup = () => {
    window.removeEventListener("mousemove", this.mouseMove);
    document.removeEventListener("mouseenter", this.mouseEnter);
    document.removeEventListener("mouseleave", this.mouseLeave);
  };
}
export class GalleryController {
  DOM;
  data: DataType;
  container;
  activeIndex = 0;
  animating = false;
  booted = false;
  cursor: Cursor;

  constructor(containerSelector: string, data: DataType) {
    this.data = data;
    const container = document.querySelector(containerSelector);

    if (!container) {
      this.DOM = {};
      return;
    }

    this.container = container;
    this.DOM = {
      next: container?.querySelector("#button-next"),
      prev: container?.querySelector("#button-prev"),
      backgrounds: container?.querySelectorAll(".background-item"),
      wrapper: container?.querySelector<HTMLDivElement>(".slider-wrapper"),
      slides: container?.querySelectorAll<HTMLDivElement>(slideItemClass),
      images: container?.querySelectorAll<HTMLDivElement>(".slide-img"),
      titles: container?.querySelectorAll<HTMLDivElement>(".gallery-title"),
    };

    this.setup();
    this.onResize();
    this.initialAnimation();

    this.cursor = new Cursor(() => this.goToSlide(this.activeIndex + 1));
  }

  initialAnimation = () => {
    const { activeIndex } = this;
    const { titles } = this.DOM;
    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        this.booted = true;
        this.cursor.animate();
      },
    });
    const slides = this.container?.querySelectorAll(slideItemClass);

    if (slides) {
      // Initial 2 items.
      const inViewItems = [
        slides[activeIndex],
        slides[activeIndex + 1],
        slides[activeIndex - 1],
      ];
      tl.from(inViewItems, {
        scale: 0,
        rotate: -10,
        yPercent: -50,
        xPercent: 180,
        ease: "circ.out",
        duration: 1.5,
        delay: 1,
      });
    }

    // Background fade - in.
    const bgItems = this.container?.querySelectorAll(".background-item");
    if (bgItems) {
      tl.to(
        bgItems[activeIndex],
        {
          scale: 2,
          opacity: 1,
          duration: 2,
          ease: "circ.inOut",
        },
        0,
      );
    }

    if (titles) {
      const wrappers = titles[activeIndex].querySelectorAll(".char-wrap");
      tl.to(wrappers, { xPercent: 0, duration: 1 }, 2);
    }

    tl.play();
  };

  setup = () => {
    const { DOM, activeIndex } = this;
    if (!DOM || !DOM.backgrounds || !DOM.backgrounds) return;

    const setupImages = () => {
      gsap.set(DOM.backgrounds, { scale: 2.5 });
      DOM.images.forEach((img, index) => {
        const isActive = index === activeIndex;
        const position = getPositions(
          index,
          activeIndex,
          img,
          DOM.slides[index],
        );
        gsap.set(img, {
          x: position.x,
          y: position.y,
          scale: isActive ? 1 : 0.5,
        });
      });
    };

    const setupTitles = () => {
      const { DOM } = this;
      if (!DOM.wrapper || (DOM.slides && DOM.slides?.length < 1)) return;
      DOM.titles.forEach((title) => {
        const split = new SplitText(title, {
          type: "chars,words",
          linesClass: "overflow-hidden",
          charsClass: "overflow-hidden",
        });
        const charsWrappers: HTMLDivElement[] = [];
        split.chars.forEach((char) => {
          const div = document.createElement("div");
          div.classList.add("char-wrap");
          div.style.position = "relative";
          div.style.display = "inline-block";
          div.style.overflow = "hidden";
          if (char.textContent) {
            div.append(char.textContent);
            char.innerHTML = "";
            char.append(div);
            charsWrappers.push(div);
          }
        });
        gsap.set(charsWrappers, { xPercent: 100 });
      });
    };

    const setupListeners = () => {
      Observer.create({
        type: "wheel,touch",
        preventDefault: true,
        onUp: () => {
          if (!this.animating) this.goToSlide(this.activeIndex - 1);
        },
        onDown: () => {
          if (!this.animating) this.goToSlide(this.activeIndex + 1);
        },
      });

      const slideClick = (slide: HTMLDivElement, index: number) => {
        if (index === this.activeIndex) return;
        gsap.to(slide, { xPercent: 0, yPercent: 0, duration: 0.2 });
        this.goToSlide(index);
      };

      this.DOM.slides?.forEach((slide, index) => {
        slide.addEventListener("click", () => slideClick(slide, index));
      });

      window.addEventListener("resize", this.onResize);
      window.addEventListener("resize", this.onResize);
      this.DOM.next?.addEventListener("click", this.nextSlide);
      this.DOM.prev?.addEventListener("click", this.prevSlide);
    };

    setupImages();
    setupTitles();
    setupListeners();
  };

  onResize = () => {
    if (this.DOM && this.DOM.slides) {
      gsap.set(".slider-wrapper", {
        width: (window.innerWidth / 3) * this.DOM.slides?.length,
      });
    }
  };

  goToSlide = (idx: number) => {
    if (idx < 0 || idx === this.data.length) return;
    this.animating = true;

    this.cursor.animate(5);
    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        this.animating = false;
        this.activeIndex = idx;
      },
    });

    const { DOM, activeIndex } = this;
    const direction = activeIndex < idx ? "prev" : "next";

    const animateWrapper = () => {
      if (DOM.wrapper && DOM.slides) {
        const activeSlide = DOM.slides[idx];
        tl.to(DOM.wrapper, { x: -(activeSlide.clientWidth * idx) }, 0);
      }
    };

    const animateImages = () => {
      if (DOM.images) {
        DOM.images.forEach((img, index) => {
          const pos = getPositions(index, idx, img, DOM.slides[index]);
          tl.to(img, { ...pos, scale: index === idx ? 1 : 0.5 }, 0);
        });
      }
    };

    const animateBackground = () => {
      // Animate background
      const bgItems = this.container?.querySelectorAll(".background-item");
      if (bgItems) {
        const percent = 50;
        bgItems.forEach((item, index) => {
          if (index === idx) {
            tl.fromTo(
              item,
              {
                opacity: 0,
                xPercent: direction === "next" ? -percent : percent,
              },
              {
                opacity: 1,
                xPercent: 0,
              },
              0,
            );
          } else {
            tl.to(
              item,
              {
                opacity: 0,
                xPercent: direction === "next" ? percent : -percent,
              },
              0,
            );
          }
        });
      }
    };

    const animateTitles = () => {
      if (!DOM.titles) return;

      // Animate Titles
      const yPercent = 5;
      const xPercent = 100;

      const charWraps = [...DOM.titles].map((item, index) => {
        return item.querySelectorAll(".char-wrap");
      });

      gsap.killTweensOf(charWraps);
      const prevTitles = charWraps[activeIndex];
      const currentTitles = charWraps[idx];

      tl.to(
        prevTitles,
        {
          duration: 0.5,
          opacity: 0,
          yPercent: direction === "next" ? -yPercent : yPercent,
          xPercent: direction === "next" ? xPercent : -xPercent,
        },
        0,
      );

      tl.fromTo(
        currentTitles,
        {
          opacity: 0,
          yPercent: direction === "next" ? yPercent : -yPercent,
          xPercent: direction === "next" ? -xPercent : xPercent,
        },
        {
          duration: 0.5,
          opacity: 1,
          yPercent: 0,
          xPercent: 0,
        },
        0.2,
      );
    };

    animateWrapper();
    animateImages();
    animateBackground();
    animateTitles();

    tl.play();
  };

  nextSlide = () => {
    if (this.booted && !this.animating) this.goToSlide(this.activeIndex + 1);
  };

  prevSlide = () => {
    if (this.booted && !this.animating) this.goToSlide(this.activeIndex - 1);
  };

  cleanup = () => {
    this.cursor.cleanup();
    window.removeEventListener("resize", this.onResize);
    window.addEventListener("resize", this.onResize);
    this.DOM.next?.addEventListener("click", this.nextSlide);
    this.DOM.prev?.addEventListener("click", this.prevSlide);
  };
}
