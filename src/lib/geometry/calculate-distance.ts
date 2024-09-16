import { checkIsInArea } from "@/lib/geometry/check-is-in-area";

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

export const detectClosestElementId = (
  parentElement: HTMLElement,
  { x, y }: { x: number; y: number }
) => {
  const rect = parentElement.getBoundingClientRect();
  const { top, bottom, left, right } = rect;
  if (!checkIsInArea({ x, y }, { top, bottom, left, right })) {
    return null;
  }

  return parentElement.getAttribute("data-element-id") || null;
};
