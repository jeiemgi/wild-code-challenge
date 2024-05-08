import { gsap, Observer } from "@/js/gsap.ts";
import { getColWidth, getMeasures, splitTitle } from "@/js/utils.ts";
import {
  animateBackgroundIn,
  animateBackgroundOut,
  animateTextIn,
  animateTextOut,
} from "@/js/animations.ts";
import CursorController from "@/js/controllers/CursorController.ts";
import type { DataType } from "@/js/data.ts";

const AUTO_PLAY_DURATION = 5;
const ITEM_CLASS = ".slide-item";

export class GalleryController {
  DOM;
  activeIndex = 0;
  animating = false;
  booted = false;
  container;
  data: DataType;
  timeoutId: number = 0;
  cursor: CursorController = new CursorController(AUTO_PLAY_DURATION);

  constructor(containerSelector: string, data: DataType) {
    this.data = data;
    const container = document.querySelector(containerSelector);

    if (!container) {
      this.DOM = {};
      return;
    }

    this.container = container;
    this.DOM = {
      next: container.querySelector("#button-next"),
      prev: container.querySelector("#button-prev"),
      backgrounds: container.querySelectorAll(".background-item"),
      wrapper: container.querySelector<HTMLDivElement>(".slider-wrapper"),
      slides: [...container!.querySelectorAll<HTMLDivElement>(ITEM_CLASS)],
      pagination: container.querySelector<HTMLDivElement>(
        ".pagination__number",
      ),
      dots: [...container.querySelectorAll<HTMLDivElement>(".pagination__dot")],
      hover: [...container.querySelectorAll("[data-hover='true']")],
      images: container.querySelectorAll<HTMLDivElement>(".slide-img"),
      titles: container.querySelectorAll<HTMLDivElement>(".gallery-title"),
      charWraps: [[]],
    };

    this.setup();
    this.addListeners();
    this.initialAnimation();
  }

  removeListeners = () => {
    this.data.forEach((_, index) => {
      this.DOM.hover![index].removeEventListener(
        "mouseenter",
        this.cursor.hoverIn,
      );
      this.DOM.hover![index].removeEventListener(
        "mouseleave",
        this.cursor.hoverOut,
      );
      this.DOM.dots![index].removeEventListener("click", this.onClick);
      this.DOM.slides![index].removeEventListener("click", this.onClick);
    });
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("resize", this.onResize);
    this.cursor.cleanup();
  };

  addListeners = () => {
    Observer.create({
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
    });
    // Add click listener to slides

    this.DOM.hover?.forEach((el) => {
      el.addEventListener("mouseenter", this.cursor.hoverIn);
      el.addEventListener("mouseleave", this.cursor.hoverOut);
    });

    this.DOM.slides?.forEach((slide) => {
      slide.addEventListener("click", this.onClick);
    });

    this.DOM.dots?.forEach((dot) => {
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
      this.goToSlide(index);
      this.start();
    }
  };

  handleActiveClassNames = () => {
    if (this.DOM.pagination)
      this.DOM.pagination.innerText = `${this.activeIndex + 1}`;

    this.DOM.dots?.forEach((dot, index) => {
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
    const setupWrapper = () => {
      if (this.DOM.wrapper) {
        const unit = window.innerWidth / 3;
        gsap.set(this.DOM.wrapper, {
          width: unit * this.data.length,
        });
      }
    };

    const setupSlides = () => {
      // Images
      this.DOM.slides?.forEach((slide, index) => {
        const slideImg = slide.querySelector(".slide-img");
        const measures = getMeasures({
          index,
          slide,
          slideImg,
          activeIndex: this.activeIndex,
        });
        gsap.set(slide, { ...measures.slide });
        gsap.set(slideImg, { ...measures.image });
      });

      // Backgrounds
      if (this.DOM.backgrounds) gsap.set(this.DOM.backgrounds, { scale: 2.5 });
    };

    const setupTitles = () => {
      this.DOM.titles?.forEach((title) => {
        const h1s = title!.querySelectorAll("h1");
        h1s.forEach((title) => {
          if (title) splitTitle(title);
        });
      });
    };

    this.handleActiveClassNames();
    setupWrapper();
    setupSlides();
    setupTitles();
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
      if (this.DOM.wrapper) {
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

  goToSlide = (newIndex: number) => {
    if (
      newIndex < 0 ||
      newIndex === this.activeIndex ||
      newIndex > this.data.length - 1
    )
      return;

    this.animating = true;
    const prevIndex = this.activeIndex;
    this.activeIndex = newIndex;

    const direction = newIndex - prevIndex;
    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        this.animating = false;
      },
    });

    const animateWrap = (start: number) => {
      if (this.DOM.wrapper && this.DOM.slides) {
        const colWidth = getColWidth();
        const slideW = colWidth * 3;
        tl.to(
          this.DOM.wrapper,
          {
            x: -(slideW * (newIndex - 1)),
            ease: "expo.out",
            duration: 0.5,
          },
          start,
        );
      }
    };

    const animateSlides = (start: number) => {
      this.DOM.slides?.forEach((slide, index) => {
        const slideImg = slide.querySelector(".slide-img");
        const measures = getMeasures({
          index,
          slide,
          slideImg,
          activeIndex: newIndex,
        });
        tl.to(slide, { ...measures.slide, duration: 0.8 }, start);
        tl.to(slideImg, { ...measures.image, duration: 0.8 }, start);

        const slideTitle = this.DOM.titles![index];

        if (slideTitle) {
          if (index === newIndex) {
            animateTextIn(slideTitle, tl, start, direction);
          } else if (index === prevIndex) {
            animateTextOut(slideTitle, direction);
          } else {
            const charWraps = slideTitle.querySelectorAll(".char-wrap");
            gsap.set(charWraps, { opacity: 0 });
          }
        }
      });
    };

    const animateBackgrounds = (start: number) => {
      this.DOM.backgrounds?.forEach((item, index) => {
        if (index === newIndex) {
          animateBackgroundIn(item, tl, start, direction);
        } else {
          animateBackgroundOut(item, tl, start, direction);
        }
      });
    };

    const animateCursor = () => {
      if (this.hasNext) {
        this.cursor.play();
      } else {
        this.cursor.stop();
      }
    };

    this.handleActiveClassNames();
    animateCursor();
    animateWrap(0);
    animateSlides(0);
    animateBackgrounds(0);

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
