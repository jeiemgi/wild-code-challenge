export const getPositions = (
  idx: number,
  activeIndex: number,
  item: HTMLDivElement,
  container?: Element | null,
) => {
  const margin = 16;
  let posX = 0;
  let posY = 0;

  const isActive = idx === activeIndex;
  const isPrev = idx === activeIndex - 1;
  const isNext = idx === activeIndex + 1;

  const containerH = container ? container.clientHeight : window.innerHeight;
  if (isActive) {
    posX = 0;
    posY = (containerH - item.clientHeight) / 2;
  } else if (isPrev) {
    posX = -(item.clientWidth / 2) - margin;
    posY = containerH - item.clientHeight / 2;
  } else if (isNext) {
    posY = 0;
    posX = -margin;
  } else if (idx > activeIndex) {
    posY = 0;
    posX = -margin;
  } else {
    posY = containerH;
    posX = -margin;
  }

  return { x: posX, y: posY };
};
