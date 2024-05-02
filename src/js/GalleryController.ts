import { gsap, Observer, SplitText } from "@/js/gsap.ts";
import { DataType } from "@/js/data.ts";

const MARGIN = 16;
const slideItemClass = ".slide-item";

const getPositions = (
  idx: number,
  activeIndex: number,
  item: HTMLDivElement,
  container?: HTMLDivElement | null,
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

export const GalleryController = (
  containerSelector: string,
  data: DataType,
) => {
  const container = document.querySelector(containerSelector)
    ? document.querySelector(containerSelector)
    : document;

  if (!container) return;

  let activeIndex = 0;
  let animating = false;

  const DOM = {
    next: container.querySelector("#button-next"),
    prev: container.querySelector("#button-prev"),
    backgrounds: [...container.querySelectorAll(".background-item")],
    wrapper: container.querySelector<HTMLDivElement>(".slider-wrapper"),
    slides: container.querySelectorAll<HTMLDivElement>(slideItemClass),
    images: container.querySelectorAll<HTMLDivElement>(".slide-img"),
    titles: container.querySelectorAll<HTMLDivElement>(".gallery-title"),
  };

  if (!DOM.wrapper || DOM.slides.length < 1) return;

  const onResize = () => {
    gsap.set(".slider-wrapper", {
      width: (window.innerWidth / 3) * DOM.slides.length,
    });
  };

  const initialAnimation = () => {
    const tl = gsap.timeline({ paused: true });
    const slides = container.querySelectorAll(slideItemClass);

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

    const bgItems = container.querySelectorAll(".background-item");
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

    const wrappers = DOM.titles[activeIndex].querySelectorAll(".char-wrap");
    tl.to(wrappers, { xPercent: 0, duration: 1 }, 2);

    tl.play();
  };

  const goToSlide = (idx: number) => {
    // TODO: LOOP
    if (animating || idx < 0 || idx === data.length) return;
    animating = true;

    const direction = activeIndex < idx ? "prev" : "next";

    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        animating = false;
        activeIndex = idx;
      },
    });

    const wrapper = gsap.utils.wrap([...DOM.slides]);
    const activeSlide = wrapper(idx);
    tl.to(DOM.wrapper, { x: -(activeSlide.clientWidth * idx) }, 0);

    DOM.images.forEach((img, index) => {
      const pos = getPositions(index, idx, img, DOM.slides[index]);
      tl.to(img, { ...pos, scale: index === idx ? 1 : 0.5 }, 0);
    });

    const bgItems = container.querySelectorAll(".background-item");
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

    const leavingWrappers =
      DOM.titles[activeIndex].querySelectorAll(".char-wrap");
    const activeWrappers = DOM.titles[idx].querySelectorAll(".char-wrap");

    const yPercent = 5;
    const xPercent = 100;

    tl.to(
      leavingWrappers,
      {
        duration: 0.5,
        opacity: 0,
        yPercent: direction === "next" ? -yPercent : yPercent,
        xPercent: direction === "next" ? xPercent : -xPercent,
      },
      0,
    );

    tl.fromTo(
      activeWrappers,
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

  const setupTitles = () => {
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

  const setup = () => {
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

    Observer.create({
      type: "wheel,touch",
      preventDefault: true,
      onUp: () => {
        if (!animating) goToSlide(activeIndex - 1);
      },
      onDown: () => {
        if (!animating) goToSlide(activeIndex + 1);
      },
    });

    setupTitles();
  };

  setup();
  onResize();
  initialAnimation();

  const nextSlide = () => {
    goToSlide(activeIndex + 1);
  };

  const prevSlide = () => {
    goToSlide(activeIndex - 1);
  };

  window.addEventListener("resize", onResize);
  window.addEventListener("resize", onResize);
  DOM.next?.addEventListener("click", nextSlide);
  DOM.prev?.addEventListener("click", prevSlide);

  return () => {
    window.removeEventListener("resize", onResize);
    DOM.next?.removeEventListener("click", nextSlide);
    DOM.prev?.removeEventListener("click", prevSlide);
  };
};
