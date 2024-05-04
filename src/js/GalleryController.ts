import { gsap, Observer, SplitText } from "@/js/gsap.ts";
import { DataType } from "@/js/data.ts";
import { MouseEvent } from "react";
import { clsx } from "clsx";

const AUTO_PLAY_DURATION = 5;
const slideItemClass = ".slide-item";

const getPositions = (
  idx: number,
  activeIndex: number,
  item: HTMLDivElement,
  container?: Element | null,
) => {
  const margin = 16;
  let posX = 0;
  let posY = 0;

  const isActive = idx === activeIndex;
  const isPrev = idx === activeIndex - 1;
  const isNext = idx === activeIndex + 1;

  const containerH = container ? container.clientHeight : window.innerHeight;
  if (isActive) {
    posX = 0;
    posY = (containerH - item.clientHeight) / 2;
  } else if (isPrev) {
    posX = -(item.clientWidth / 2) - margin;
    posY = containerH - item.clientHeight / 2;
  } else if (isNext) {
    posY = 0;
    posX = -margin;
  } else if (idx > activeIndex) {
    posY = 0;
    posX = -margin;
  } else {
    posY = containerH;
    posX = -margin;
  }

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
    console.log("restart-play cursor");
    this.timeline.restart();
    this.timeline.play(0);
  };

  reverse = () => {
    console.log("reverse cursor");
    this.timeline.reverse();
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
  activeIndex = 0;
  animating = false;
  booted = false;
  container;
  data: DataType;
  timeoutId: number = 0;
  cursor: Cursor = new Cursor(AUTO_PLAY_DURATION);

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
    // this.goToSlide(this.activeIndex);
  }

  initialAnimation = () => {
    const { activeIndex } = this;

    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        this.booted = true;
      },
    });

    const animateImages = () => {
      const slides = this.container?.querySelectorAll(slideItemClass);
      if (slides) {
        // Initial 2 items.

        const activeSlide = slides[activeIndex];
        const nextSlide = slides[activeIndex + 1];

        tl.from(
          activeSlide,
          {
            rotate: 20,
            xPercent: -250,
            duration: 1,
            ease: "power2.out",
          },
          0.2,
        );

        tl.from(
          nextSlide,
          {
            duration: 0.5,
            rotate: -10,
            xPercent: 300,
            ease: "power2.out",
          },
          0.2,
        );
      }
    };

    const animateBackground = () => {
      if (this.DOM.backgrounds) {
        tl.to(
          this.DOM.backgrounds[activeIndex],
          {
            opacity: 1,
            duration: 1,
            ease: "circ.out",
          },
          0,
        );
      }
    };

    const animateTitle = () => {
      // Initial animation
      if (this.DOM.titles) {
        const title = this.DOM.titles[activeIndex];
        const charWrappers = title.querySelectorAll(".char-wrap");
        tl.set(".char-wrap", { opacity: 1 }, 0);
        tl.to(charWrappers, { xPercent: 0, ease: "circ.out", duration: 1 }, 1);
      }
    };

    animateImages();
    animateBackground();
    animateTitle();

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

      const splitText = (h1: HTMLHeadingElement) => {
        const split = new SplitText(h1, {
          type: "lines,words,chars",
          linesClass: clsx("line"),
          wordsClass: clsx("word"),
          charsClass: clsx("char"),
        });
        split.chars.forEach((char) => {
          // We need an additional wrapper on the text to animate the content.
          if (char.textContent) {
            const div = document.createElement("div");
            div.append(char.textContent);
            div.classList.add("char-wrap");
            gsap.set(div, { xPercent: 100 });
            char.innerHTML = "";
            char.append(div);
          }
        });
      };

      DOM.titles.forEach((title, index) => {
        const h1Els = title.querySelectorAll("h1");
        h1Els.forEach((h1) => splitText(h1));

        if (index === activeIndex) title.classList.add("gallery-title--active");
        else title.classList.remove("gallery-title--active");
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

  goToSlide = (newIndex: number) => {
    if (
      newIndex < 0 ||
      newIndex === this.activeIndex ||
      newIndex > this.data.length - 1
    )
      return;

    console.log("goToSlide", newIndex);

    this.animating = true;
    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        this.activeIndex = newIndex;
        this.animating = false;
      },
    });

    const isRight = newIndex > this.activeIndex;

    const animateWrapper = (start: number) => {
      if (this.DOM.wrapper && this.DOM.slides) {
        const activeSlide = this.DOM.slides[newIndex];
        tl.to(
          this.DOM.wrapper,
          { x: -(activeSlide.clientWidth * newIndex) },
          start,
        );
      }
    };

    const animateImages = (start: number) => {
      this.DOM.images?.forEach((img, imgIndex) => {
        if (this.DOM.slides) {
          const slide = this.DOM.slides[imgIndex];
          const scale = imgIndex === newIndex ? 1 : 0.5;
          const pos = getPositions(imgIndex, newIndex, img, slide);
          tl.to(img, { ...pos, scale }, start);
        }
      });
    };

    const animateBackground = (start: number) => {
      // Animate background
      const bgItems = this.container?.querySelectorAll(".background-item");
      if (bgItems) {
        const percent = 50;
        bgItems.forEach((item, index) => {
          if (index === newIndex) {
            tl.fromTo(
              item,
              {
                opacity: 0,
                xPercent: isRight ? -percent : percent,
              },
              {
                opacity: 1,
                xPercent: 0,
              },
              start,
            );
          } else {
            tl.to(
              item,
              {
                opacity: 0,
                xPercent: isRight ? percent : -percent,
              },
              start,
            );
          }
        });
      }
    };

    const animateTitles = (start: number, enterDelay: number) => {
      if (!this.DOM.titles) return;
      const yPercent = 50;
      const xPercent = 100;

      this.DOM.titles.forEach((title, index) => {
        if (newIndex === index) {
          const lines = [...title.querySelectorAll(".line")];
          const charWraps = lines.map((line) =>
            line.querySelectorAll(".char-wrap"),
          );
          console.log(charWraps);

          tl.fromTo(
            title,
            {
              yPercent: isRight ? yPercent : -yPercent,
              xPercent: isRight ? -xPercent : xPercent,
            },
            {
              yPercent: 0,
              xPercent: 0,
              duration: 0.5,
            },
            start,
          );

          tl.fromTo(
            charWraps,
            {
              opacity: 1,
              xPercent: isRight ? xPercent : -xPercent,
            },
            {
              opacity: 1,
              xPercent: 0,
              duration: 0.5,
            },
            start + enterDelay,
          );
        } else if (index === this.activeIndex) {
          const charWraps = title.querySelectorAll(".char-wrap");
          tl.to(
            title,
            {
              yPercent: isRight ? yPercent : -yPercent,
              xPercent: isRight ? -xPercent : xPercent,
            },
            start,
          );
          tl.to(
            charWraps,
            {
              opacity: 0,
              duration: 0.4,
            },
            start,
          );
        } else {
          const charWraps = title.querySelectorAll(".char-wrap");
          gsap.set(charWraps, { opacity: 0 });
          gsap.set(title, { xPercent: 0, yPercent: 0 });
        }
      });
    };

    animateTitles(0, 0.2);
    animateWrapper(0);
    animateBackground(0);
    animateImages(0);

    tl.play();
  };

  start = () => {
    console.log("this.activeIndex", this.activeIndex);
    if (this.activeIndex < this.data.length - 1) {
      clearTimeout(this.timeoutId);
      this.cursor.play();
      this.timeoutId = setTimeout(() => {
        this.nextSlide();
      }, AUTO_PLAY_DURATION * 1000);
    }
  };

  nextSlide = () => {
    console.log("click");
    if (this.booted && !this.animating) {
      this.goToSlide(this.activeIndex + 1);
      // this.start();
    }
  };

  prevSlide = () => {
    if (this.booted && !this.animating) {
      this.goToSlide(this.activeIndex - 1);
      // this.start();
    }
  };

  cleanup = () => {
    this.cursor.cleanup();
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("resize", this.onResize);
    this.DOM.next?.removeEventListener("click", this.nextSlide);
    this.DOM.prev?.removeEventListener("click", this.prevSlide);
  };
}
