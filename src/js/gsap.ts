import { gsap } from "gsap";
import Observer from "gsap/Observer";
import SplitText from "gsap/SplitText";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollToPlugin from "gsap/ScrollToPlugin";
import CustomBounce from "gsap/CustomBounce";

gsap.registerPlugin(
  ScrollTrigger,
  ScrollToPlugin,
  SplitText,
  Observer,
  CustomBounce,
);

gsap.defaults({
  duration: 0.6,
  ease: "expo.out",
});

export { gsap, ScrollTrigger, SplitText, Observer, CustomBounce };
