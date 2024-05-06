import Cursor from "@/js/Cursor.ts";
import { DataType } from "@/js/data.ts";
import { gsap, Observer, SplitText } from "@/js/gsap.ts";
import { clsx } from "clsx";
import { getPositions } from "@/js/utils.ts";

const AUTO_PLAY_DURATION = 5;
const slideItemClass = ".slide-item";

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

    const animateSlides = () => {
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
        const lines = title.querySelectorAll(".line");
        lines.forEach((line, item) => {
          const lineChars = line.querySelectorAll(".char-wrap");
          tl.to(
            lineChars,
            {
              opacity: 1,
              duration: 1,
              xPercent: 0,
              stagger: {
                from: "center",
                amount: 0.1,
              },
            },
            0.7,
          );
        });

        // const charWrappers = title.querySelectorAll(".char-wrap");
        // tl.to(charWrappers, { xPercent: 0, ease: "circ.out", duration: 1 }, 1);
      }
    };

    animateSlides();
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

      const slideClick = (_: HTMLDivElement, index: number) => {
        if (index !== this.activeIndex) {
          this.goToSlide(index);
        }
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
          tl.fromTo(
            title,
            {
              yPercent: isRight ? yPercent : -yPercent,
              xPercent: isRight ? -xPercent : xPercent,
            },
            {
              stagger: {
                from: "edges",
                amount: 0.02,
              },
              yPercent: 0,
              xPercent: 0,
              duration: 0.5,
            },
            start,
          );

          const fromVars = {
            opacity: 1,
            xPercent: isRight ? xPercent : -xPercent,
          };
          const toVars = {
            opacity: 1,
            xPercent: 0,
            duration: 0.5,
          };
          tl.fromTo(charWraps, fromVars, toVars, start + enterDelay);
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
