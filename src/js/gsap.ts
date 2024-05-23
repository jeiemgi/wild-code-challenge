import { gsap } from "gsap";
import SplitText from "gsap/SplitText";
import Draggable from "gsap/Draggable";
import Observer from "gsap/Observer";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollSmoother from "gsap/ScrollSmoother";
import ScrollToPlugin from "gsap/ScrollToPlugin";

gsap.registerPlugin(
  ScrollTrigger,
  ScrollToPlugin,
  SplitText,
  Observer,
  Draggable,
);

gsap.defaults({
  duration: 0.6,
  ease: "expo.out",
});

export { gsap, ScrollSmoother, ScrollTrigger, SplitText, Observer, Draggable };
