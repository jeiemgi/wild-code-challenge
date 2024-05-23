import styled from "styled-components";
import { useEffect, useRef } from "react";
import { gsap, SplitText } from "@/js/gsap";
import Cursor from "@/components/Cursor.tsx";
import type { PropsWithChildren } from "react";

const Header = styled.header`
  top: 0;
  left: 0;
  position: fixed;
  width: 100%;
  padding: 16px;
  z-index: 999;

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
      <div id="smooth-wrapper">
        <div id="smooth-content">{children}</div>
      </div>
      <Cursor />
    </>
  );
}

export default Layout;
