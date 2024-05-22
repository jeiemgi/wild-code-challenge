import { gsap } from "gsap";
import SplitText from "gsap/SplitText";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollSmoother from "gsap/ScrollSmoother";
import ScrollToPlugin from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText);

gsap.defaults({
  duration: 0.6,
  ease: "expo.out",
});

export { gsap, ScrollSmoother, ScrollTrigger, SplitText };
