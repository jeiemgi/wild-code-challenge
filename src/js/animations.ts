import { gsap, ScrollTrigger } from "@/js/gsap";
import { getImageMeasures } from "@/js/utils.ts";
import GalleryController from "@/js/controllers/GalleryController.ts";

export const enterLeaveInterpolation = ({
  target,
  trigger,
  enterVars,
  enterTriggers,
  containerAnimation,
  leaveVars,
  leaveTriggers,
  onUpdate,
}: {
  target: GSAPTweenTarget;
  trigger: Element;
  enterVars: GSAPTweenVars[];
  leaveVars: GSAPTweenVars[];
  enterTriggers: Array<string>;
  leaveTriggers: Array<string>;
  containerAnimation: GSAPAnimation;
  onUpdate?: (self: ScrollTrigger) => void;
}) => {
  const enter = gsap.utils.interpolate(enterVars);
  ScrollTrigger.create({
    trigger,
    start: enterTriggers[0],
    end: enterTriggers[1],
    containerAnimation,
    onUpdate: (self) => {
      gsap.set(target, { ...enter(self.progress) });
      if (onUpdate) onUpdate(self);
    },
  });

  const leave = gsap.utils.interpolate(leaveVars);
  ScrollTrigger.create({
    trigger,
    start: leaveTriggers[0],
    end: leaveTriggers[1],
    containerAnimation,
    onUpdate: (self) => {
      gsap.set(target, { ...leave(self.progress) });
      if (onUpdate) onUpdate(self);
    },
  });
};
export const imagesInterpolation = (
  timeline: GSAPTimeline,
  self: GalleryController,
) => {
  if (!self.options) return;

  const slideMeasures = {
    x: self.measures.slide.x || 0,
    y: self.measures.slide.y || 0,
    width: self.measures.slide.width || 0,
    height: self.measures.slide.height || 0,
  };

  const prevMeasures = getImageMeasures(slideMeasures, -1, self.options);
  const activeMeasures = getImageMeasures(slideMeasures, 0, self.options);
  const nextMeasures = getImageMeasures(slideMeasures, 1, self.options);

  const leaveTriggers = ["50% center", "149.9% center"];
  const enterTriggers = ["-50% center", "49.9% center"];
  const leaveVars = [activeMeasures, prevMeasures];
  const enterVars = [nextMeasures, activeMeasures];

  self.DOM.slides?.forEach((slide, index) => {
    if (
      self.DOM.images &&
      self.DOM.images[index] &&
      self.measures.slide.width &&
      self.measures.slide.height
    ) {
      const image = self.DOM.images[index];
      enterLeaveInterpolation({
        target: image,
        trigger: slide,
        enterTriggers,
        leaveTriggers,
        enterVars,
        leaveVars,
        containerAnimation: timeline,
      });
    }
  });
};

export const titlesInterpolation = (
  timeline: GSAPTimeline,
  self: GalleryController,
) => {
  const leaveTriggers = ["50% center", "right center"];
  const enterTriggers = ["left center", "center center"];
  const enterVars = [{ xPercent: 100 }, { xPercent: 0 }];
  const leaveVars = [{ xPercent: 0 }, { xPercent: -100 }];

  self.DOM.titles?.forEach((title, index) => {
    if (self.DOM.titles && self.DOM.slides && self.DOM.slides[index]) {
      const charWraps = title.querySelectorAll(".char-wrap");
      enterLeaveInterpolation({
        target: charWraps,
        trigger: self.DOM.slides[index],
        enterTriggers,
        leaveTriggers,
        enterVars,
        leaveVars,
        containerAnimation: timeline,
      });
    }
  });
};

export const backgroundInterpolation = (
  timeline: GSAPTimeline,
  self: GalleryController,
) => {
  const leaveTriggers = ["50% center", "right center"];
  const enterTriggers = ["left center", "center center"];
  const enterVars = [
    { opacity: 0, xPercent: 20 },
    { opacity: 1, xPercent: 0 },
  ];
  const leaveVars = [
    { opacity: 1, xPercent: 0 },
    { opacity: 0, xPercent: -20 },
  ];

  self.DOM.backgrounds?.forEach((bg, index) => {
    if (self.DOM.slides) {
      enterLeaveInterpolation({
        target: bg,
        trigger: self.DOM.slides[index],
        enterTriggers,
        leaveTriggers,
        enterVars,
        leaveVars,
        containerAnimation: timeline,
      });
    }
  });
};
