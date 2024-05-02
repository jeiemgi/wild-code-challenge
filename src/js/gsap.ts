import { gsap } from "gsap";
import Observer from "gsap/Observer";
import SplitText from "gsap/SplitText";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, SplitText, Observer);

gsap.defaults({
  ease: "expo.inOut",
  duration: 0.6,
});

export { gsap, ScrollTrigger, SplitText, Observer };
