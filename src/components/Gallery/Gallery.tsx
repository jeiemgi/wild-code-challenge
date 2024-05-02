import styled from "styled-components";
import { DataType } from "@/App.tsx";
import { useEffect, useRef, useState } from "react";
import { gsap, Observer } from "@/js/gsap";
import { clsx } from "clsx";

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background: black;
  overflow: hidden;
`;

const Background = styled.div`
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  filter: blur(80px);
  background-size: 100%;
  background-position: center;
`;

interface Props {
  data: DataType;
}

const slideItemClass = ".slide-item";

function Gallery({ data }: Props) {
  const getPositions = (
    idx: number,
    active: number,
    width: number,
    height: number,
  ) => {
    const isActive = idx === active;
    const isPrev = idx === active - 1;

    if (isPrev) console.log(idx);

    let posX = 0;
    if (isPrev) posX = -width / 2;

    let posY = 0;
    if (isActive) posY = (window.innerHeight - height) / 2;
    else if (isPrev) posY = window.innerHeight - height / 2;
    else if (idx < active - 1) posY = window.innerHeight;
    else if (idx > active + 1) posY = -height / 2;

    return { x: posX, y: posY };
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      let activeIndex = 0;
      let animating = false;

      const DOM = {
        next: document.querySelector("#button-next"),
        prev: document.querySelector("#button-prev"),
        wrapper: document.querySelector(".slider-wrapper"),
        backgrounds: [...document.querySelectorAll(".background-item")],
        slides: document.querySelectorAll<HTMLDivElement>(slideItemClass),
        images: document.querySelectorAll<HTMLDivElement>(".slide-img"),
      };

      if (!DOM.wrapper || DOM.slides.length < 1) return;

      const onResize = () => {
        gsap.set(".slider-wrapper", {
          width: (window.innerWidth / 3) * DOM.slides.length,
        });
      };

      const initialAnimation = () => {
        const tl = gsap.timeline({ paused: true });
        const slides = document.querySelectorAll(slideItemClass);

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

        const bgItems = document.querySelectorAll(".background-item");
        tl.set(
          bgItems[activeIndex],
          {
            scale: 2,
            opacity: 0,
            filter: "blur(500px)",
          },
          0,
        );

        tl.to(
          bgItems[activeIndex],
          {
            scale: 1.5,
            opacity: 1,
            duration: 2,
            filter: "blur(10px)",
            ease: "circ.inOut",
          },
          0,
        );

        tl.play();
      };

      const goToSlide = (idx: number) => {
        // TODO: LOOP
        if (animating || idx < 0 || idx === data.length) return;

        animating = true;

        const DOM = {
          wrapper: document.querySelector(".slider-wrapper"),
          slides: document.querySelectorAll<HTMLDivElement>(slideItemClass),
          images: document.querySelectorAll<HTMLDivElement>(".slide-img"),
        };

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
          const pos = getPositions(
            index,
            idx,
            img.clientWidth,
            img.clientHeight,
          );
          tl.to(img, { ...pos, scale: index === idx ? 1 : 0.5 }, 0);
        });

        const direction = activeIndex < idx ? "prev" : "next";
        const bgItems = document.querySelectorAll(".background-item");

        bgItems.forEach((item, index) => {
          if (index === idx) {
            tl.fromTo(
              item,
              {
                opacity: 0,
                filter: "blur(80px)",
                xPercent: direction === "next" ? -10 : 10,
              },
              {
                opacity: 1,
                xPercent: 0,
                filter: "blur(10px)",
              },
              0,
            );
          } else {
            tl.to(
              item,
              {
                opacity: 0,
                filter: "blur(10px)",
                xPercent: direction === "next" ? 10 : -10,
              },
              0,
            );
          }
        });

        tl.play();
      };

      const setup = () => {
        DOM.images.forEach((img, index) => {
          const isActive = index === activeIndex;
          const { width, height } = img.getBoundingClientRect();
          const position = getPositions(index, activeIndex, width, height);
          gsap.set(img, {
            x: position.x,
            y: position.y,
            scale: isActive ? 1 : 0.5,
          });
        });

        DOM.backgrounds.forEach((bgItem) => {
          gsap.set(DOM.backgrounds, {
            scale: bgItem ? 2 : 1.5,
          });
        });

        Observer.create({
          type: "wheel,touch",
          onUp: () => {
            if (!animating) goToSlide(activeIndex - 1);
          },
          onDown: () => {
            if (!animating) goToSlide(activeIndex + 1);
          },
        });

        onResize();
      };

      setup();
      initialAnimation();

      const nextSlide = () => {
        goToSlide(activeIndex + 1);
      };

      const prevSlide = (direction: string) => {
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
    });

    return () => ctx.revert();
  }, []);

  return (
    <Wrapper>
      <div className={"absolute size-full overflow-hidden"}>
        {data.map((el, index) => {
          return (
            <Background
              key={`Background-Item-${index}`}
              className={`background-item absolute size-full bg-cover bg-center opacity-0`}
              style={{
                backgroundImage: `url(${data[index].image})`,
              }}
            />
          );
        })}
      </div>

      <div className={"slider relative size-full overflow-hidden"}>
        <div
          className={
            "slider-wrapper absolute left-1/3 top-0 flex h-full items-center"
          }
        >
          {data.map((item, index) => {
            return (
              <div
                key={`Gallery-Item-${index}`}
                className={
                  "slide-item flex size-full items-start will-change-transform"
                }
              >
                <img
                  src={item.image}
                  alt={`Image template ${index}`}
                  className={clsx(
                    "slide-img  h-3/4 w-full origin-top-right rounded-[40px] object-cover will-change-transform",
                  )}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div
        className={
          "fixed left-10 top-10 z-10 overflow-hidden rounded-md bg-white/50 shadow-2xl backdrop-blur-3xl"
        }
      >
        <button
          id={"button-prev"}
          className={
            "border-r border-white/30 p-5 font-bold hover:bg-black hover:text-white active:bg-black active:text-white"
          }
        >
          Prev
        </button>
        <button
          id={"button-next"}
          className={
            "p-5 font-bold hover:bg-black hover:text-white active:bg-black active:text-white"
          }
        >
          Next
        </button>
      </div>
    </Wrapper>
  );
}

export default Gallery;
