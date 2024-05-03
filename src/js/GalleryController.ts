import { gsap, Observer, SplitText } from "@/js/gsap.ts";
import { DataType } from "@/js/data.ts";

const MARGIN = 16;
const slideItemClass = ".slide-item";

const getPositions = (
  idx: number,
  activeIndex: number,
  item: HTMLDivElement,
  container?: Element | null,
) => {
  let posX = -MARGIN;
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

export class GalleryController {
  DOM;
  data: DataType;
  container;
  activeIndex = 0;
  animating = false;

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
  }

  initialAnimation = () => {
    const { activeIndex } = this;
    const { titles } = this.DOM;
    const tl = gsap.timeline({ paused: true });
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

    gsap.set(DOM.backgrounds, { scale: 2.5 });
    DOM.images.forEach((img, index) => {
      const isActive = index === activeIndex;
      const position = getPositions(index, activeIndex, img, DOM.slides[index]);
      gsap.set(img, {
        x: position.x,
        y: position.y,
        scale: isActive ? 1 : 0.5,
      });
    });

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

    const setupWheel = () => {
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
    };

    const setupListeners = () => {
      window.addEventListener("resize", this.onResize);
      window.addEventListener("resize", this.onResize);
      this.DOM.next?.addEventListener("click", this.nextSlide);
      this.DOM.prev?.addEventListener("click", this.prevSlide);
    };

    setupWheel();
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
    if (
      this.animating ||
      idx < 0 ||
      idx === this.data.length ||
      !this.DOM ||
      !this.DOM.backgrounds
    )
      return;
    this.animating = true;
    const { DOM, activeIndex } = this;
    const direction = activeIndex < idx ? "prev" : "next";
    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        this.animating = false;
        this.activeIndex = idx;
      },
    });

    const wrapper = gsap.utils.wrap([...DOM.slides]);
    const activeSlide = wrapper(idx);
    tl.to(DOM.wrapper, { x: -(activeSlide.clientWidth * idx) }, 0);

    DOM.images.forEach((img, index) => {
      const pos = getPositions(index, idx, img, DOM.slides[index]);
      tl.to(img, { ...pos, scale: index === idx ? 1 : 0.5 }, 0);
    });

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

    // Animate Titles
    const yPercent = 5;
    const xPercent = 100;
    const prevTitles = DOM.titles[activeIndex].querySelectorAll(".char-wrap");
    const currentTitles = DOM.titles[idx].querySelectorAll(".char-wrap");

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

    tl.play();
  };

  nextSlide = () => {
    this.goToSlide(this.activeIndex + 1);
  };

  prevSlide = () => {
    this.goToSlide(this.activeIndex - 1);
  };

  cleanup = () => {
    window.removeEventListener("resize", this.onResize);
    window.addEventListener("resize", this.onResize);
    this.DOM.next?.addEventListener("click", this.nextSlide);
    this.DOM.prev?.addEventListener("click", this.prevSlide);
  };
}
