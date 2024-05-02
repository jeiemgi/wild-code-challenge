import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Observer from "gsap/Observer";

gsap.registerPlugin(ScrollTrigger, Observer);

gsap.defaults({
  ease: "expo.inOut",
  duration: 0.6,
});

export { gsap, ScrollTrigger, Observer };
