// 마우스 좌표와 요소 중심점 간의 유클리드 거리 계산 함수
export const calculateDistance = (
  mouseX: number,
  mouseY: number,
  rect: DOMRect
) => {
  const elementCenterX = rect.left + rect.width / 2;
  const elementCenterY = rect.top + rect.height / 2;
  return Math.sqrt(
    Math.pow(mouseX - elementCenterX, 2) + Math.pow(mouseY - elementCenterY, 2)
  );
};
