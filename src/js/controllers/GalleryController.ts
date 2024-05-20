import { gsap, Observer, ScrollTrigger } from "@/js/gsap.ts";
import {
  getActiveMeasures,
  getColWidth,
  getMeasures,
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
  tweenImageIn,
  tweenImageOut,
} from "@/js/animations.ts";
import CursorController from "@/js/controllers/CursorController.ts";
import type { GalleryData } from "@/js/data.ts";

const AUTO_PLAY_DURATION = 5;

export class GalleryController {
  activeIndex = 0;
  animating = false;
  booted = false;
  cursor: CursorController = new CursorController(AUTO_PLAY_DURATION);
  data: GalleryData;
  timeoutId: number = 0;

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
      titles: querySelectorAll(el, ".slide-titles__item"),
    };
  }

  removeListeners = () => {
    this.data.forEach((_, index) => {
      if (this.DOM.hovers) {
        this.DOM.hovers[index].removeEventListener(
          "mouseenter",
          this.cursor.hoverIn,
        );
        this.DOM.hovers[index].removeEventListener(
          "mouseleave",
          this.cursor.hoverOut,
        );
      }

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
    /*Observer.create({
      type: "wheel,touch",
      preventDefault: true,
      onUp: () => {
        if (!this.animating && this.booted)
          this.goToSlide(this.activeIndex - 1);
      },
      onDown: () => {
        if (!this.animating && this.booted)
          this.goToSlide(this.activeIndex + 1);
      },
    });*/

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
    const colWidth = getColWidth();
    const slideWidth = colWidth * 4;

    const setupWrapper = () => {
      if (this.DOM.wrapper)
        gsap.set(this.DOM.wrapper, {
          xPercent: 30,
          width: slideWidth * this.data.length - 1,
        });
    };

    const setupSlide = (index: number) => {
      const slideDiv = this.DOM.slides ? this.DOM.slides[index] : null;
      const slideImg = slideDiv?.querySelector(".slide-img");

      if (slideDiv && slideImg) {
        const measures = getMeasures(index, this.activeIndex, slideDiv);
        gsap.set(slideDiv, { ...measures.slide });
        // gsap.set(slideImg, { ...measures.image });
      }
    };

    const setupTitle = (index: number) => {
      if (this.DOM.titles) {
        const titleDiv = this.DOM.titles[index];
        const h1s = querySelectorAll(titleDiv, "h1");
        h1s?.forEach((title) => {
          if (title) splitTitle(title);
        });
      }
    };

    const scrollTrigger = () => {
      if (this.DOM.wrapper && this.container) {
        const maxScroll = -(
          this.DOM.wrapper.clientWidth +
          window.innerWidth / 2
        );
        // To have a scrollable div behind
        // gsap.set(this.container, { height: wrapper.clientWidth });

        // Scroll animation
        gsap.to(this.DOM.wrapper, {
          xPercent: -100,
          ease: "none",
          scrollTrigger: {
            end: "+=100%",
            pin: true,
            scrub: 2,
            markers: true,
            trigger: this.container,
          },
        });

        /*this.DOM.slides.forEach((slide, index) => {
          this.tweenSlide(slide, index, scrollTween);
        });*/
      }
    };

    this.handleActiveClassNames();

    const setupBackgrounds = () => {
      if (this.DOM.backgrounds) gsap.set(this.DOM.backgrounds, { scale: 2.5 });
    };

    setupWrapper();

    this.data.forEach((_, index) => {
      setupSlide(index);
      // setupTitle(index);
    });

    // setupTitles();
    // scrollTrigger();
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

  onResize = () => {
    this.setup();
  };

  tweenSlide = (
    slide: HTMLDivElement,
    index: number,
    containerAnimation: GSAPTween,
  ) => {
    const animateSlide = () => {
      const slideTitle = this.DOM.titles![index];
      tweenImageIn(slide, containerAnimation);
      tweenImageOut(slide, containerAnimation);
      scrollTextIn(slideTitle, slide, containerAnimation);
      scrollTextOut(slideTitle, slide, containerAnimation);

      // OUT
      // tl.to(credit, { opacity: 0, duration: 1 }, 0);

      // OUT
      //const charWraps = slideTitle.querySelectorAll(".char-wrap");
      // gsap.set(charWraps, { opacity: 0 });
    };

    const animateBackground = () => {
      const bg = this.DOM.backgrounds![index];
      scrollBackgroundIn(bg, slide);
      scrollBackgroundOut(bg, slide);
    };

    animateSlide();
    animateBackground();
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
