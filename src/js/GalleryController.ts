import Cursor from "@/js/Cursor.ts";
import { gsap, Observer } from "@/js/gsap.ts";
import { getMeasures, splitTitle } from "@/js/utils.ts";
import { animateTextIn, animateTextOut } from "@/js/animations.ts";
import type { DataType } from "@/js/data.ts";

const AUTO_PLAY_DURATION = 5;
const SLIDE_ITEM_CLASS = ".slide-item";

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
      slides: container
        ? [...container.querySelectorAll<HTMLDivElement>(SLIDE_ITEM_CLASS)]
        : [],
      images: container?.querySelectorAll<HTMLDivElement>(".slide-img"),
      titles: container?.querySelectorAll<HTMLDivElement>(".gallery-title"),
      charWraps: [[]],
    };

    this.setup();
    this.setupListeners();
    this.initialAnimation();
  }

  cleanup = () => {
    this.cursor.cleanup();
    this.DOM.slides?.forEach((slide) => {
      slide.removeEventListener("click", this.slideClick);
    });
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("resize", this.onResize);
    this.DOM.next?.removeEventListener("click", this.nextSlide);
    this.DOM.prev?.removeEventListener("click", this.prevSlide);
  };

  slideClick = (e: MouseEvent) => {
    const target = e.target ? (e.target as HTMLDivElement) : e.target;
    const index = e.target! ? Number(target?.dataset.index) : 0;
    if (index !== this.activeIndex) {
      this.goToSlide(index);
      this.start();
    }
  };

  handleActiveClassNames = () => {
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

  setupListeners = () => {
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
    this.DOM.slides?.forEach((slide) => {
      slide.addEventListener("click", this.slideClick);
    });
    window.addEventListener("resize", this.onResize);
    window.addEventListener("resize", this.onResize);
    this.DOM.next?.addEventListener("click", this.nextSlide);
    this.DOM.prev?.addEventListener("click", this.prevSlide);
  };

  setup = () => {
    const setupWrapper = () => {
      gsap.set(".slider-wrapper", {
        width: (window.innerWidth / 3) * this.DOM.slides!.length,
      });
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

        // Titles
        const titles = slide.querySelectorAll("h1");
        titles.forEach((title) => {
          if (title) splitTitle(title);
        });
      });

      // Backgrounds
      if (this.DOM.backgrounds) gsap.set(this.DOM.backgrounds, { scale: 2.5 });
    };

    this.handleActiveClassNames();
    setupWrapper();
    setupSlides();
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
        animateTextIn(title, tl, 0.8);
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
    this.handleActiveClassNames();

    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        this.animating = false;
      },
    });

    const animateWrap = (start: number) => {
      if (this.DOM.wrapper && this.DOM.slides) {
        const slideWidth = this.DOM.slides[0].clientWidth;
        tl.to(
          this.DOM.wrapper,
          { x: -slideWidth * (newIndex - 1), ease: "expo.out", duration: 0.5 },
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
          activeIndex: this.activeIndex,
        });
        tl.to(slide, { ...measures.slide, duration: 0.8 }, start);
        tl.to(slideImg, { ...measures.image, duration: 0.8 }, start);
        tl.to(slideImg, { ...measures.image, duration: 0.8 }, start);

        const slideTitle =
          slide.querySelector<HTMLDivElement>(".gallery-title");

        if (slideTitle) {
          if (index === newIndex) {
            animateTextIn(slideTitle, tl, start + 0.2, newIndex - prevIndex);
          } else if (index === prevIndex) {
            animateTextOut(slideTitle, newIndex - prevIndex);
          } else {
            const charWraps = slideTitle.querySelectorAll(".char-wrap");
            gsap.set(charWraps, { opacity: 0 });
          }
        }
      });
    };

    const animateBackground = (start: number) => {
      // Animate background
      const isRight = newIndex > this.activeIndex;
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

    animateWrap(0);
    animateSlides(0);
    animateBackground(0);

    tl.play();
  };

  get canAnimate() {
    return (
      this.booted && !this.animating && this.activeIndex < this.data.length - 1
    );
  }

  start = () => {
    clearTimeout(this.timeoutId);
    this.cursor.play();

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

  prevSlide = () => {
    if (this.canAnimate) {
      this.goToSlide(this.activeIndex - 1);
      this.start();
    } else {
      this.stop();
    }
  };
}

export default GalleryController;
