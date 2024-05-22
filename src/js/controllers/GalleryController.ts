import { gsap, ScrollTrigger, Draggable } from "@/js/gsap.ts";
import {
  debounce,
  getImageMeasures,
  querySelector,
  querySelectorAll,
  splitTitle,
} from "@/js/utils.ts";
import CursorController from "@/js/controllers/CursorController.ts";
import {
  backgroundInterpolation,
  imagesInterpolation,
  titlesInterpolation,
} from "@/js/animations.ts";
import type { GalleryData } from "@/js/data.ts";

const AUTO_PLAY_DURATION = 5;
const defaultMeasures = {
  centerLeft: 0,
  slide: { x: 0, y: 0, height: 0, width: 0 },
};

export type GalleryOptions = {
  mobile: boolean;
  mediaQuery: string;
  centered: boolean;
  slidesPerView: number;
  imageXPercent: number;
  alignImageRight: boolean;
};

type Measures = typeof defaultMeasures;

export class GalleryController {
  booted = false;
  animating = false;
  timeoutId: number = 0;
  activeIndex = 0;
  cursor: CursorController = new CursorController(AUTO_PLAY_DURATION);
  data: GalleryData;
  measures: Measures = defaultMeasures;

  options?: GalleryOptions;
  configs: GalleryOptions[] = [
    {
      mobile: true,
      mediaQuery: "(max-width: 600px)",
      centered: false,
      slidesPerView: 1,
      imageXPercent: 1,
      alignImageRight: false,
    },
    {
      mobile: true,
      mediaQuery: "(min-width: 601px) and (max-width: 1200px)",
      centered: true,
      slidesPerView: 2,
      imageXPercent: 0.8,
      alignImageRight: false,
    },
    {
      mobile: false,
      mediaQuery: "(min-width: 1201px)",
      centered: true,
      slidesPerView: 3,
      imageXPercent: 0.5,
      alignImageRight: true,
    },
  ];

  scrollTrigger: ScrollTrigger;

  DOM: {
    dragProxy: HTMLDivElement | null;
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
    const wrapper = querySelector(el, ".gallery__wrapper");

    if (!el) throw new Error("No container found");
    if (!wrapper) throw new Error("No wrapper found");

    this.scrollTrigger = ScrollTrigger.create({ trigger: el });

    this.DOM = {
      container: el,
      wrapper,
      backgrounds: querySelectorAll(el, ".slide-background-item"),
      credits: querySelectorAll(el, ".credit"),
      hovers: querySelectorAll(el, "[data-hover='true']"),
      dragProxy: querySelector(el, ".drag-proxy"),
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
    if (this.DOM.container && this.options) {
      this.measures = defaultMeasures;

      let slideW = window.innerWidth / this.options.slidesPerView;
      slideW = Number(slideW.toFixed(2));

      let slideH = this.DOM.container?.clientHeight;
      slideH = Number(slideH.toFixed(2));

      // setSlideMeasures
      const slideMeasures = {
        x: 0,
        y: 0,
        width: slideW,
        height: slideH,
      };
      gsap.set(this.DOM.slides, { ...slideMeasures });

      // setImageMeasures
      this.DOM.images?.forEach((img, index) => {
        if (this.options) {
          const imgMeasures = getImageMeasures(
            { width: slideW, height: slideH },
            index - this.activeIndex,
            this.options,
          );
          gsap.set(img, { ...imgMeasures });
        }
      });

      const slidesWidth = slideW * this.data.length;
      const centerLeft = window.innerWidth / 2 - slideW / 2;

      gsap.set(this.DOM.wrapper, {
        width: slidesWidth,
        paddingLeft: this.options.centered ? centerLeft : 0,
      });

      this.measures = {
        centerLeft,
        slide: slideMeasures,
      };
    } else {
      console.log("No options");
    }
  };

  onResizeFinished = debounce(() => {
    this.matchMediaCheck();
    this.setupScroll();
  }, 150);

  addListeners = () => {
    //window.addEventListener("resize", this.onResize);
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
    //window.removeEventListener("resize", this.onResize);
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

  handleActiveClassNames = () => {
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

    const { activeIndex } = this;

    const setIndexClassName = (
      el: HTMLDivElement,
      className: string,
      index: number,
    ) => {
      const prevClass = `${className}--prev`;
      const activeClass = `${className}--active`;
      const nextClass = `${className}--next`;
      el.classList.remove(prevClass, nextClass, activeClass);
      if (index === activeIndex - 1) el.classList.add(prevClass);
      else if (index === activeIndex) el.classList.add(activeClass);
      else if (index === activeIndex + 1) el.classList.add(nextClass);
    };

    this.DOM.credits?.forEach((credit, index) => {
      setIndexClassName(credit, "credit", index);
    });
    this.DOM.slides?.forEach((slide, index) => {
      setIndexClassName(slide, "slide", index);
    });
  };

  setupScroll = () => {
    if (!this.DOM.wrapper || !this.DOM.dragProxy || !this.DOM.slides) return;

    ScrollTrigger.killAll();

    const duration = 1;
    const count = this.data.length - 1;

    const createScrollerTimeline = () => {
      const tl = gsap.timeline({});

      // Add labels for snapping
      this.DOM.slides?.forEach((_, index) => {
        tl.add("label" + index, index * (duration / count));
      });

      tl.to(this.DOM.slides, {
        duration,
        ease: "none",
        xPercent: -100 * count,
      });

      imagesInterpolation(tl, this);
      titlesInterpolation(tl, this);
      backgroundInterpolation(tl, this);

      return tl;
    };

    let prevIndex = this.activeIndex;
    const tl = createScrollerTimeline();
    const wrapperRect = this.DOM.wrapper.getBoundingClientRect();
    const maxScroll = wrapperRect.width - window.innerWidth;

    const trigger = ScrollTrigger.create({
      scrub: 1,
      pin: true,
      animation: tl,
      trigger: this.DOM.container,
      start: "top top",
      end: () => "+=" + wrapperRect.width,
      onUpdate: (s) => {
        this.activeIndex = Math.ceil(s.progress * this.data.length) - 1;
        if (this.activeIndex !== prevIndex) {
          this.handleActiveClassNames();
          prevIndex = this.activeIndex;
        }
      },
      snap: {
        delay: 0.01,
        duration: 1,
        ease: "power4.out",
        snapTo: "labelsDirectional",
      },
    });

    let dragRatio: number;
    let dragClamp: (value: number) => number;

    Draggable.create(this.DOM.dragProxy, {
      type: "x",
      lockAxis: true,
      inertia: true,
      resistance: 1,
      trigger: this.DOM.wrapper,
      onPress() {
        ScrollTrigger.refresh();
        this.startScroll = trigger.scroll();
      },
      onDrag: function () {
        const clampedX = dragClamp(
          this.startScroll - (this.x - this.startX) * dragRatio,
        );
        gsap.to(window, { scrollTo: clampedX });
      },
      onThrowUpdate: function () {
        const clampedX = dragClamp(
          this.startScroll - (this.x - this.startX) * dragRatio,
        );
        gsap.to(window, { scrollTo: clampedX });
      },
    });

    ScrollTrigger.addEventListener("refresh", () => {
      if (!this.DOM.wrapper) return;
      dragClamp = gsap.utils.clamp(trigger.start + 1, trigger.end - 1);
      dragRatio = wrapperRect.width / maxScroll;
    });

    /*document.addEventListener("keyup", (e) => {
      const id = e.target.getAttribute("href");
      if (!id || e.key !== "Tab") return;
      const section = document.querySelector(id);
      const y = section.getBoundingClientRect().top + window.scrollY;
      trigger.scroll(y);
    });*/

    this.scrollTrigger = trigger;
  };

  matchMediaCheck = () => {
    this.configs.forEach((opts) => {
      if (window.matchMedia(opts.mediaQuery).matches) {
        this.options = opts;
        this.setMeasures();
        this.setupScroll();
      }
    });
  };

  setup = () => {
    const splitTitles = () => {
      // Split chars
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

    splitTitles();
    this.addListeners();
    this.handleActiveClassNames();
    this.matchMediaCheck();
    this.initialAnimation();
  };

  initialAnimation = (vars?: GSAPTimelineVars) => {
    const tl = gsap.timeline({
      delay: 0.5,
      defaults: {
        duration: 0.8,
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

    tl.play();
  };

  goToSlide = (index: number) => {
    gsap.to(window, {
      duration: 1,
      ease: "power4.out",
      scrollTo: this.scrollTrigger.labelToScroll("label" + index),
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
