import { gsap, Observer, ScrollTrigger } from "@/js/gsap.ts";
import {
  clamp,
  getActiveMeasures,
  getImageMeasures,
  querySelector,
  querySelectorAll,
  splitTitle,
} from "@/js/utils.ts";
import {
  animateBackgroundIn,
  animateBackgroundOut,
  animateTextIn,
  animateTextOut,
  scrollBackgroundIn,
  scrollBackgroundOut,
  scrollTextIn,
  scrollTextOut,
  scrollTriggerInterpolate,
  tweenImageIn,
  tweenImageOut,
} from "@/js/animations.ts";
import CursorController from "@/js/controllers/CursorController.ts";
import type { GalleryData } from "@/js/data.ts";

const AUTO_PLAY_DURATION = 5;

interface GalleryConfig {
  centered: boolean;
  itemsInView: number;
  breakpoints?: { [key: string]: Partial<Omit<GalleryConfig, "breakpoints">> };
}

const defaultConfig: GalleryConfig = {
  centered: true,
  itemsInView: 3,

  breakpoints: {
    "(max-width: 400px)": {
      itemsInView: 1,
    },
  },
};

const defaultMeasures = {
  centerLeft: 0,
  wrapper: {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  },
  slide: {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  },
};

export class GalleryController {
  activeIndex = 0;
  animating = false;
  booted = false;
  cursor: CursorController = new CursorController(AUTO_PLAY_DURATION);
  data: GalleryData;
  timeoutId: number = 0;

  config = defaultConfig;

  measures = defaultMeasures;

  animatableProps = {
    wrapper: {
      x: {
        previous: 0,
        current: 0,
        next: 0,
      },
    },
  };

  DOM: {
    container: HTMLDivElement | null;
    wrapper: HTMLDivElement | null;
    backgrounds: NodeListOf<HTMLDivElement> | null;
    credits: NodeListOf<HTMLDivElement> | null;
    hovers: NodeListOf<HTMLDivElement> | null;
    nextBtn: HTMLDivElement | null;
    paginationDots: NodeListOf<HTMLDivElement> | null;
    paginationNumber: HTMLDivElement | null;
    prevBtn: HTMLDivElement | null;
    slides: NodeListOf<HTMLDivElement> | null;
    images: NodeListOf<HTMLDivElement> | null;
    titles: NodeListOf<HTMLDivElement> | null;
  };

  constructor(containerSelector: string, data: GalleryData) {
    this.data = data;
    const el = document.querySelector<HTMLDivElement>(`#${containerSelector}`);
    const wrapper = querySelector(el, ".gallery__scroller");

    if (!el) throw new Error("No container found");
    if (!wrapper) throw new Error("No wrapper found");

    this.DOM = {
      container: el,
      wrapper,
      backgrounds: querySelectorAll(el, ".background-item"),
      credits: querySelectorAll(el, ".credit"),
      hovers: querySelectorAll(el, "[data-hover='true']"),
      nextBtn: querySelector(el, "#button-next"),
      paginationDots: querySelectorAll(el, ".pagination__dot"),
      paginationNumber: querySelector(el, ".pagination__dot"),
      prevBtn: querySelector(el, "#button-prev"),
      slides: querySelectorAll(el, ".slide-item"),
      images: querySelectorAll(el, ".slide-img"),
      titles: querySelectorAll(el, ".slide-titles__item"),
    };
  }

  setMeasures = () => {
    if (this.DOM.container) {
      const { itemsInView, centered } = this.config;
      const slideW = window.innerWidth / itemsInView;
      const slideH = this.DOM.container?.clientHeight;
      const wrapperW = slideW * this.data.length;
      const wrapperH = this.DOM.container?.clientHeight;

      const border = this.data.length * 2;
      const centerLeft = window.innerWidth / 2 - slideW / 2;

      let activeSlideX = this.activeIndex * slideW;
      if (centered) activeSlideX += centerLeft;

      this.measures = {
        centerLeft,
        wrapper: {
          y: 0,
          x: activeSlideX,
          height: wrapperH,
          width: wrapperW + border,
        },
        slide: {
          x: 0,
          y: 0,
          width: slideW,
          height: slideH,
        },
      };

      gsap.set(this.DOM.wrapper, this.measures.wrapper);
      gsap.set(this.DOM.slides, { ...this.measures.slide });
    }
  };

  removeListeners = () => {
    this.data.forEach((_, index) => {
      this.DOM.hovers?.forEach((el) => {
        el.removeEventListener("mouseenter", this.cursor.hoverIn);
        el.removeEventListener("mouseleave", this.cursor.hoverOut);
      });

      if (
        this.DOM.paginationDots &&
        this.DOM.paginationDots[index] &&
        this.DOM.slides &&
        this.DOM.slides[index]
      ) {
        this.DOM.paginationDots[index].removeEventListener(
          "click",
          this.onClick,
        );
        this.DOM.slides[index].removeEventListener("click", this.onClick);
      }
    });

    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("resize", this.onResize);

    this.cursor.cleanup();
  };

  addListeners = () => {
    // Add click listener to slides
    this.DOM.hovers?.forEach((el) => {
      el.addEventListener("mouseenter", this.cursor.hoverIn);
      el.addEventListener("mouseleave", this.cursor.hoverOut);
    });

    this.DOM.slides?.forEach((slide) => {
      slide.addEventListener("click", this.onClick);
    });

    this.DOM.paginationDots?.forEach((dot) => {
      dot.addEventListener("click", this.onClick);
    });

    window.addEventListener("resize", this.onResize);
    window.addEventListener("resize", this.onResize);
  };

  get hasNext() {
    return this.activeIndex < this.data.length - 1;
  }

  get canAnimate() {
    return this.booted && !this.animating && this.hasNext;
  }

  onClick = (e: MouseEvent) => {
    const target = e.target ? (e.target as HTMLDivElement) : e.target;
    const index = Number(target?.dataset.index);
    if (index === 0 || (index && index !== this.activeIndex)) {
      // this.goToSlide(index);
      this.start();
    }
  };

  handleActiveClassNames = () => {
    if (this.DOM.paginationNumber)
      this.DOM.paginationNumber.innerText = `${this.activeIndex + 1}`;

    this.DOM.paginationDots?.forEach((dot, index) => {
      if (this.activeIndex === index) {
        dot.classList.add("pagination__dot--active");
      } else {
        dot.classList.remove("pagination__dot--active");
      }
    });

    this.DOM.slides?.forEach((slide, index) => {
      const { activeIndex } = this;
      const className = "slide";
      const prevClass = `${className}--prev`;
      const activeClass = `${className}--active`;
      const nextClass = `${className}--next`;
      slide.classList.remove(prevClass, nextClass, activeClass);
      if (index === activeIndex - 1) slide.classList.add(prevClass);
      else if (index === activeIndex) slide.classList.add(activeClass);
      else if (index === activeIndex + 1) slide.classList.add(nextClass);
    });
  };

  setup = () => {
    const setupTitles = () => {
      this.DOM.titles?.forEach((titleDiv) => {
        const h1s = querySelectorAll(titleDiv, "h1");
        h1s?.forEach((title) => {
          if (title) splitTitle(title);
        });
      });
    };

    const setupImages = () => {
      this.DOM.images?.forEach((img, index) => {
        const measures = getImageMeasures(
          this.measures.slide,
          index - this.activeIndex,
        );
        gsap.set(img, { ...measures });
      });
    };

    const setupScroll = () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          scrub: 1,
          snap: {
            duration: 0.05,
            ease: "power2.out",
            snapTo: "labelsDirectional",
          },
          pin: true,
          trigger: this.DOM.container,
          end: () => `+=${this.data.length * 100}%`,
        },
      });

      const duration = 1;
      const count = this.data.length - 1;

      this.DOM.slides?.forEach((slide, index) => {
        tl.add("label" + index, index * (duration / count));

        if (this.DOM.images && this.DOM.images[index]) {
          const image = this.DOM.images[index];

          scrollTriggerInterpolate({
            trigger: slide,
            element: image,
            fromPosition: 0,
            toPosition: -1,
            start: "50% center",
            end: "149.9% center",
            containerAnimation: tl,
          });

          const prevImage = this.DOM.images[index - 1]
            ? this.DOM.images[index - 1]
            : null;
          if (prevImage) {
            scrollTriggerInterpolate({
              trigger: slide,
              element: image,
              fromPosition: 1,
              toPosition: 0,
              start: "-50% center",
              end: "49.9% center",
              containerAnimation: tl,
            });
          }
        }
      });

      tl.to(this.DOM.slides, {
        xPercent: -100 * count,
        duration,
        ease: "none",
      });
    };

    this.handleActiveClassNames();
    this.setMeasures();
    setupTitles();
    setupImages();
    setupScroll();
    //setupBackgrounds();
  };

  onResize = () => {
    this.setup();
  };

  start = () => {
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.nextSlide();
    }, AUTO_PLAY_DURATION * 1000);
  };

  stop = () => {
    clearTimeout(this.timeoutId);
    this.cursor.timeline.pause(0);
  };

  initialAnimation = () => {
    const { activeIndex } = this;

    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        this.booted = true;
      },
    });

    const animateScroll = () => {
      if (this.DOM.wrapper && this.DOM.slides) {
        const slideWidth = this.DOM.slides[0].clientWidth;
        tl.fromTo(
          this.DOM.wrapper,
          { x: window.innerWidth },
          { x: slideWidth / 2, duration: 1 },
          0.5,
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

    const animateCopy = () => {
      if (this.DOM.titles) {
        const title = this.DOM.titles[activeIndex];
        animateTextIn(title, tl, 0.5);

        gsap.to(".ui-initial", {
          opacity: 1,
          duration: 1,
          delay: 1.2,
        });

        const credit = querySelectorAll(this.container, "");
        gsap.to(credit, { opacity: 1, duration: 1, delay: 1.2 });
      }
    };

    animateBackground();
    animateScroll();
    animateCopy();

    tl.play();
  };

  nextSlide = () => {
    if (this.canAnimate) {
      this.goToSlide(this.activeIndex + 1);
      this.start();
    } else {
      this.stop();
    }
  };
}

export default GalleryController;
