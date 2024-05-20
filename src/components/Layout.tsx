import styled from "styled-components";
import { PropsWithChildren, useEffect, useRef } from "react";
import { gsap, SplitText } from "@/js/gsap.ts";

const Cursor = styled.div`
  position: fixed;
  width: 46px;
  height: 46px;
  top: -20px;
  left: -20px;
  pointer-events: none;
  opacity: 0;

  &::after {
    top: 20px;
    left: 20px;
    position: absolute;
    content: "";
    width: 4px;
    height: 4px;
    display: block;
    background: white;
    border-radius: 100%;
  }

  &::before {
    top: 0;
    left: 0;
    position: absolute;
    content: "";
    width: 44px;
    height: 44px;
    display: block;
    border-radius: 100%;
    border: solid 2px rgba(255, 255, 255, 0.1);
  }

  svg {
    fill: transparent;
    stroke: white;
    stroke-width: 2;
    stroke-dasharray: 150;
    stroke-dashoffset: 150;
    transform: translateY(-2px) rotate(-90deg);
  }
`;

const Header = styled.header`
  top: 0;
  left: 0;
  position: fixed;
  width: 100%;
  padding: 16px;

  #logo {
    font-family: "Tungsten", sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 1em;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #ffffff;
  }
`;

function Layout({ children }: PropsWithChildren) {
  const timelineRef = useRef<GSAPTimeline>(gsap.timeline({ paused: true }));

  useEffect(() => {
    const ctx = gsap.context(() => {
      const split = new SplitText("#logo", { type: "chars" });
      timelineRef.current.from(
        split.chars,
        {
          y: -100,
          duration: 0.5,
          stagger: {
            from: "random",
            amount: 0.3,
          },
          ease: "expo.out",
        },
        1,
      );
      timelineRef.current.play();
    });

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <>
      <Header>
        <nav className={"inline-block overflow-hidden"}>
          <ul>
            <li>
              <a href={"/"} id={"logo"} role={"button"} data-hover>
                XYZ Photography
              </a>
            </li>
          </ul>
        </nav>
      </Header>

      {children}

      <Cursor id="ui-cursor">
        <svg height="46" width="46" strokeLinecap={"round"}>
          <circle cx="22" cy="22" r="21" />
        </svg>
      </Cursor>
    </>
  );
}

export default Layout;
