import { gsap, ScrollTrigger } from "@/js/gsap.ts";
import {
  debounce,
  getImageMeasures,
  querySelector,
  querySelectorAll,
  splitTitle,
} from "@/js/utils.ts";
import CursorController from "@/js/controllers/CursorController.ts";
import type { GalleryData } from "@/js/data.ts";
import { enterLeaveInterpolation } from "@/js/animations.ts";

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

const defaultMeasures = { slide: { x: 0, y: 0, height: 0, width: 0 } };
type Measure = { x?: number; y?: number; width?: number; height?: number };
type Measures = Record<keyof typeof defaultMeasures, Measure>;

export class GalleryController {
  booted = false;
  animating = false;
  timeoutId: number = 0;
  activeIndex = 0;
  cursor: CursorController = new CursorController(AUTO_PLAY_DURATION);
  data: GalleryData;
  measures: Measures = defaultMeasures;
  config: GalleryConfig;
  scrollTimeline: GSAPTimeline | null = null;

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

    this.DOM = {
      container: el,
      wrapper,
      backgrounds: querySelectorAll(el, ".slide-background-item"),
      credits: querySelectorAll(el, ".credit"),
      hovers: querySelectorAll(el, "[data-hover='true']"),
      nextBtn: querySelector(el, "#button-next"),
      paginationDots: querySelectorAll(el, ".pagination__dot"),
      paginationNumber: querySelector(el, ".pagination__number"),
      prevBtn: querySelector(el, "#button-prev"),
      slides: querySelectorAll(el, ".slide-item"),
      images: querySelectorAll(el, ".slide-item__img"),
      titles: querySelectorAll(el, ".slide-title-item"),
    };
  }

  setMeasures = () => {
    if (this.DOM.container) {
      this.measures = defaultMeasures;
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
    gsap.to(this.DOM.container, { xPercent: -10, opacity: 0 });
  };

  onResizeFinished = debounce(() => {
    ScrollTrigger.killAll();
    this.setup();
    gsap.to(this.DOM.container, { xPercent: 0, opacity: 1 });
  }, 500);

  addListeners = () => {
    window.addEventListener("resize", this.onResize);
    window.addEventListener("resize", this.onResizeFinished);

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
  };

  removeListeners = () => {
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("resize", this.onResizeFinished);

    this.DOM.slides?.forEach((slide) => {
      slide.removeEventListener("click", this.onClick);
    });

    this.DOM.hovers?.forEach((el) => {
      el.removeEventListener("mouseenter", this.cursor.hoverIn);
      el.removeEventListener("mouseleave", this.cursor.hoverOut);
    });

    this.DOM.paginationDots?.forEach((dot) => {
      dot.removeEventListener("click", this.onClick);
    });

    this.cursor.cleanup();
  };

  handleActiveClassNames = (initial = false, prevIndex = 0) => {
    if (this.DOM.credits && !initial) {
      gsap.killTweensOf(this.DOM.credits);
      gsap.to(this.DOM.credits[prevIndex], { opacity: 0 });
      gsap.to(this.DOM.credits[this.activeIndex], { opacity: 1 });
    }

    if (this.DOM.paginationNumber) {
      this.DOM.paginationNumber.innerText = `${this.activeIndex + 1}`;
    }

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

  setupScroll = () => {
    const duration = 1;
    const count = this.data.length - 1;
    let prevIndex = this.activeIndex;

    const timeline = gsap.timeline({
      scrollTrigger: {
        scrub: 0.1,
        onUpdate: (s) => {
          if (s.progress <= 1) {
            this.activeIndex = Math.ceil(s.progress * this.data.length) - 1;
            if (this.activeIndex !== prevIndex) {
              this.handleActiveClassNames(false, prevIndex);
              prevIndex = this.activeIndex;
            }
          }
        },
        snap: {
          delay: 0.01,
          duration: 1,
          ease: "power4.out",
          snapTo: "labelsDirectional",
        },
        pin: true,
        trigger: this.DOM.container,
        end: () => `+=${this.data.length * 150}%`,
      },
    });

    timeline.to(this.DOM.slides, {
      duration,
      ease: "none",
      xPercent: -100 * count,
    });

    const imagesInterpolation = () => {
      const slideMeasures = {
        x: this.measures.slide.x || 0,
        y: this.measures.slide.y || 0,
        width: this.measures.slide.width || 0,
        height: this.measures.slide.height || 0,
      };

      const prevMeasures = getImageMeasures(slideMeasures, -1);
      const activeMeasures = getImageMeasures(slideMeasures, 0);
      const nextMeasures = getImageMeasures(slideMeasures, 1);

      const leaveTriggers = ["50% center", "149.9% center"];
      const enterTriggers = ["-50% center", "49.9% center"];
      const leaveVars = [activeMeasures, prevMeasures];
      const enterVars = [nextMeasures, activeMeasures];

      this.DOM.slides?.forEach((slide, index) => {
        timeline.add("label" + index, index * (duration / count));
        if (
          this.DOM.images &&
          this.DOM.images[index] &&
          this.measures.slide.width &&
          this.measures.slide.height
        ) {
          const image = this.DOM.images[index];
          enterLeaveInterpolation({
            target: image,
            trigger: slide,
            enterTriggers,
            leaveTriggers,
            enterVars,
            leaveVars,
            containerAnimation: timeline,
          });
        }
      });
    };

    const titlesInterpolation = () => {
      const leaveTriggers = ["50% center", "right center"];
      const enterTriggers = ["left center", "center center"];
      const enterVars = [{ xPercent: 100 }, { xPercent: 0 }];
      const leaveVars = [{ xPercent: 0 }, { xPercent: -100 }];

      this.DOM.titles?.forEach((title, index) => {
        if (this.DOM.titles && this.DOM.slides && this.DOM.slides[index]) {
          const charWraps = title.querySelectorAll(".char-wrap");
          enterLeaveInterpolation({
            target: charWraps,
            trigger: this.DOM.slides[index],
            enterTriggers,
            leaveTriggers,
            enterVars,
            leaveVars,
            containerAnimation: timeline,
          });
        }
      });
    };

    const backgroundInterpolation = () => {
      const leaveTriggers = ["50% center", "right center"];
      const enterTriggers = ["left center", "center center"];
      const enterVars = [
        { opacity: 0, xPercent: 20 },
        { opacity: 1, xPercent: 0 },
      ];
      const leaveVars = [
        { opacity: 1, xPercent: 0 },
        { opacity: 0, xPercent: -20 },
      ];

      this.DOM.backgrounds?.forEach((bg, index) => {
        if (this.DOM.slides) {
          enterLeaveInterpolation({
            target: bg,
            trigger: this.DOM.slides[index],
            enterTriggers,
            leaveTriggers,
            enterVars,
            leaveVars,
            containerAnimation: timeline,
          });
        }
      });
    };

    imagesInterpolation();
    titlesInterpolation();
    backgroundInterpolation();
    this.scrollTimeline = timeline;
  };

  setup = () => {
    const setupTitles = () => {
      this.DOM.titles?.forEach((titleDiv) => {
        const h1s = querySelectorAll(titleDiv, "h1");
        h1s?.forEach((title) => {
          splitTitle(title);
        });
        const wraps = titleDiv.querySelectorAll(".char-wrap");
        gsap.set(wraps, {
          xPercent: 100,
        });
      });
    };

    const setupBackgrounds = () => {
      this.DOM.backgrounds?.forEach((bg) => {
        gsap.set(bg, { opacity: 0 });
      });
    };

    this.setMatchMedia();
    this.setMeasures();
    this.addListeners();
    this.handleActiveClassNames(true);

    setupTitles();
    setupBackgrounds();

    this.setupScroll();
  };

  initialAnimation = (vars: GSAPTimelineVars) => {
    const tl = gsap.timeline({
      delay: 0.5,
      defaults: {
        duration: 1.5,
        ease: "power4.out",
      },
      paused: true,
      ...vars,
    });

    tl.to(".ui-initial", { opacity: 1 }, 0);
    tl.from(this.DOM.slides, { xPercent: 20, opacity: 0, stagger: 0.2 }, 0);

    if (this.DOM.titles) {
      const titleDiv = this.DOM.titles[this.activeIndex];
      const wraps = titleDiv.querySelectorAll(".char-wrap");
      tl.to(wraps, { xPercent: 0 }, 0);
    }

    if (this.DOM.backgrounds) {
      const activeBg = this.DOM.backgrounds[this.activeIndex];
      tl.from(activeBg, { xPercent: -50 }, 0);
      tl.to(activeBg, { opacity: 1 }, 0);
    }

    if (this.DOM.credits) {
      tl.to(this.DOM.credits[this.activeIndex], { opacity: 1 }, 0);
    }

    tl.play();
  };

  goToSlide = (index: number) => {
    gsap.to(window, {
      duration: 1,
      ease: "power4.out",
      scrollTo: this.scrollTimeline?.scrollTrigger?.labelToScroll(
        "label" + index,
      ),
    });
  };

  onClick = (e: MouseEvent) => {
    const target = e.target ? (e.target as HTMLDivElement) : e.target;
    const index = Number(target?.dataset.index);
    if (index === 0 || (index && index !== this.activeIndex)) {
      this.goToSlide(index);
    }
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

  get hasNext() {
    return this.activeIndex < this.data.length - 1;
  }

  get canAnimate() {
    return this.booted && !this.animating && this.hasNext;
  }
}

export default GalleryController;
