export const checkIsInArea = (
  mouse: { x: number; y: number },
  target: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  }
) => {
  const { x, y } = mouse;
  const { left, right, top, bottom } = target;

  if (x < left || x > right || y < top || y > bottom) return false;
  return true;
};
