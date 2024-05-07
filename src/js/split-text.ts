import type SplitText from "gsap/SplitText";

export const wrapChar = (split: SplitText) =>
  // We need an additional wrapper on the text to animate the content.
  split.chars.map((char) => {
    if (char.textContent) {
      const wrap = document.createElement("div");
      wrap.append(char.textContent);
      wrap.classList.add("char");
      char.innerHTML = "";
      char.append(wrap);
      return wrap;
    }
  });
