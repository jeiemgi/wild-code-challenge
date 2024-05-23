export function buildSeamlessLoop(items, spacing, animateFunc) {
  let rawSequence = gsap.timeline({ paused: true }), // this is where all the "real" animations live
    seamlessLoop = gsap.timeline({
      // this merely scrubs the playhead of the rawSequence so that it appears to seamlessly loop
      paused: true,
      repeat: -1, // to accommodate infinite scrolling/looping
      onRepeat() {
        // works around a super rare edge case bug that's fixed GSAP 3.6.1
        this._time === this._dur && (this._tTime += this._dur - 0.01);
      },
      onReverseComplete() {
        this.totalTime(this.rawTime() + this.duration() * 100); // seamless looping backwards
      },
    }),
    cycleDuration = spacing * items.length,
    dur; // the duration of just one animateFunc() (we'll populate it in the .forEach() below...

  // loop through 3 times so we can have an extra cycle at the start and end - we'll scrub the playhead only on the 2nd cycle
  items
    .concat(items)
    .concat(items)
    .forEach((item, i) => {
      let anim = animateFunc(items[i % items.length]);
      rawSequence.add(anim, i * spacing);
      dur || (dur = anim.duration());
    });

  // animate the playhead linearly from the start of the 2nd cycle to its end (so we'll have one "extra" cycle at the beginning and end)
  seamlessLoop.fromTo(
    rawSequence,
    {
      time: cycleDuration + dur / 2,
    },
    {
      time: "+=" + cycleDuration,
      duration: cycleDuration,
      ease: "none",
    },
  );
  return seamlessLoop;
}
