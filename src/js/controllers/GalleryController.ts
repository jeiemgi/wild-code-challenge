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

type MatchMediaConfig = {
  mediaQuery: string;
  options: GalleryOptions;
};

type GalleryOptions = {
  centered: boolean;
  slidesPerView: number;
};

type GalleryConfig = GalleryOptions & {
  breakpoints?: {
    [key: string]: GalleryOptions;
  };
};
type Measure = { x?: number; y?: number; width?: number; height?: number };
type Measures = Record<string, Measure>;

export class GalleryController {
  activeIndex = 0;
  animating = false;
  booted = false;
  cursor: CursorController = new CursorController(AUTO_PLAY_DURATION);
  data: GalleryData;
  timeoutId: number = 0;
  slideTriggers: ScrollTrigger[] = [];
  config: GalleryConfig;
  measures: Measures;
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

  constructor(
    containerSelector: string,
    data: GalleryData,
    config: GalleryConfig,
  ) {
    this.data = data;
    const el = document.querySelector<HTMLDivElement>(`#${containerSelector}`);
    const wrapper = querySelector(el, ".gallery__wrapper");

    if (!el) throw new Error("No container found");
    if (!wrapper) throw new Error("No wrapper found");

    this.config = config;

    this.measures = {
      slide: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      },
    };

    this.slideTriggers = [];
    this.DOM = {
      container: el,
      wrapper,
      backgrounds: querySelectorAll(el, ".gallery__background__item"),
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
      console.clear();
      console.log(".--------setMeasures");

      this.measures = {};
      const slideW = window.innerWidth / this.config.slidesPerView;
      const slideH = this.DOM.container?.clientHeight;

      const setSlideMeasures = () => {
        this.measures.slide = {
          x: 0,
          y: 0,
          width: slideW,
          height: slideH,
        };

        gsap.set(this.DOM.slides, { ...this.measures.slide });
      };

      const setImageMeasures = () => {
        this.DOM.images?.forEach((img, index) => {
          const imgMeasures = getImageMeasures(
            { width: slideW, height: slideH },
            index - this.activeIndex,
          );
          gsap.set(img, { ...imgMeasures });
        });
      };

      const setWrapperPadding = () => {
        gsap.set(this.DOM.wrapper, {
          paddingLeft: this.config.centered
            ? window.innerWidth / 2 - slideW / 2
            : 0,
        });
      };

      setSlideMeasures();
      setImageMeasures();
      setWrapperPadding();
    }
  };

  setMatchMedia = () => {
    if (this.DOM.container) {
      const defaultConfig = { ...this.config };
      delete defaultConfig.breakpoints;
      const mm = gsap.matchMedia(this.DOM.container);
      const matchMediaArray: MatchMediaConfig[] = [];

      if (this.config.breakpoints) {
        const breakpointsKeys = Object.keys(this.config.breakpoints).map((br) =>
          Number(br),
        );

        matchMediaArray.push({
          mediaQuery: `(max-width: ${breakpointsKeys[0] - 1}px)`,
          options: defaultConfig,
        });

        breakpointsKeys.forEach((br, index, array) => {
          const nextItem = array[index + 1];
          matchMediaArray.push({
            mediaQuery: `(min-width: ${br}px) ${nextItem ? `and (max-width: ${nextItem}px)` : ``} `,
            options: {
              ...defaultConfig,
              ...this.config.breakpoints![br],
            },
          });
        });
      } else {
        matchMediaArray.push({
          mediaQuery: "",
          options: defaultConfig,
        });
      }

      matchMediaArray.forEach((item) => {
        mm.add(item.mediaQuery, () => (this.config = item.options));
      });
    }
  };

  onResize = () => {
    this.setMeasures();
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
    this.cursor.cleanup();
  };

  addListeners = () => {
    window.addEventListener("resize", this.onResize);

    // Add click listener to slides
    /*this.DOM.hovers?.forEach((el) => {
      el.addEventListener("mouseenter", this.cursor.hoverIn);
      el.addEventListener("mouseleave", this.cursor.hoverOut);
    });

    this.DOM.slides?.forEach((slide) => {
      slide.addEventListener("click", this.onClick);
    });

    this.DOM.paginationDots?.forEach((dot) => {
      dot.addEventListener("click", this.onClick);
    });*/
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

    const setupScroll = () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          scrub: 1,
          snap: {
            duration: 0.005,
            ease: "power1.out",
            snapTo: "labelsDirectional",
          },
          pin: true,
          trigger: this.DOM.container,
          end: () => `+=${this.data.length * 150}%`,
        },
      });

      const duration = 1;
      const count = this.data.length - 1;

      const slideMeasures = {
        x: this.measures.slide.x || 0,
        y: this.measures.slide.y || 0,
        width: this.measures.slide.width || 0,
        height: this.measures.slide.height || 0,
      };

      const prevMeasures = getImageMeasures(slideMeasures, -1);
      const activeMeasures = getImageMeasures(slideMeasures, 0);
      const nextMeasures = getImageMeasures(slideMeasures, 1);

      this.DOM.slides?.forEach((slide, index) => {
        tl.add("label" + index, index * (duration / count));

        if (
          this.DOM.images &&
          this.DOM.images[index] &&
          this.measures.slide.width &&
          this.measures.slide.height
        ) {
          const image = this.DOM.images[index];

          const activeInterpolation = gsap.utils.interpolate([
            activeMeasures,
            prevMeasures,
          ]);

          ScrollTrigger.create({
            markers: true,
            trigger: slide,
            start: "50% center",
            end: "149.9% center",
            containerAnimation: tl,
            onUpdate: (self) => {
              gsap.set(image, activeInterpolation(self.progress));
            },
          });

          const prevImage = this.DOM.images[index - 1]
            ? this.DOM.images[index - 1]
            : null;
          if (prevImage) {
            const restInterpolation = gsap.utils.interpolate([
              nextMeasures,
              activeMeasures,
            ]);

            ScrollTrigger.create({
              trigger: slide,
              start: "-50% center",
              end: "49.9% center",
              containerAnimation: tl,
              onUpdate: (self) => {
                gsap.set(image, restInterpolation(self.progress));
              },
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

    this.setMatchMedia();

    this.setMeasures();
    this.addListeners();
    this.handleActiveClassNames();
    setupTitles();
    setupScroll();
    //setupBackgrounds();
  };

  initialAnimation = () => {
    const { activeIndex } = this;

    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        this.booted = true;
      },
    });

    const animateBackground = () => {
      if (this.DOM.backgrounds) {
        tl.to(
          this.DOM.backgrounds[activeIndex],
          {
            opacity: 1,
            duration: 1,
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
    //animateCopy();

    tl.play();
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
