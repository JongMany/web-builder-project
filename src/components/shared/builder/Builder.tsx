import { checkIsInArea } from "@/lib/geometry/check-is-in-area";
import { calculateDistance } from "@/lib/geometry/calculate-distance";
import { ElementModelTree } from "@/models/element/element.model";
import { useDndElementStore } from "@/stores/dnd-element.store";
import {
  MouseEvent as ReactMouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";

const Builder = () => {
  const elementTree = useRef(new ElementModelTree());
  const { activeElement } = useDndElementStore();
  const builderRef = useRef<HTMLDivElement>(null);

  const [closestElementId, setClosestElementId] = useState<string | null>(null);
  // 각 Element에 대한 refs 저장
  // 특정 부모 요소 내에서 자식 요소 탐색
  const detectClosestChildElement = (
    parentElement: HTMLElement,
    mouseX: number,
    mouseY: number
  ) => {
    let closestId = null;
    let minDistance = Infinity;

    // 부모 요소 내의 모든 자식 요소 탐색
    parentElement
      .querySelectorAll("[data-element-id]")
      .forEach((childElement) => {
        const rect = childElement.getBoundingClientRect();
        const distance = calculateDistance(mouseX, mouseY, rect);
        console.log(rect, distance, minDistance);
        // TODO: 확인해볼게
        if (distance < minDistance) {
          minDistance = distance;
          closestId = childElement.getAttribute("data-element-id");
          console.log(closestId);
        }
      });

    // 가장 가까운 자식 요소를 상태로 저장
    setClosestElementId(closestId);
  };

  // 공간을 감지하는 함수
  const detectSpaceHandler = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!activeElement || !builderRef.current) return;

    const { clientX: x, clientY: y } = event;

    // 각 요소의 거리 계산
    detectClosestChildElement(builderRef.current, x, y);
  };

  console.log(closestElementId);

  // 추가해주는 함수
  const addElementHandler = (ev: MouseEvent) => {
    if (!builderRef.current) return;
    const { left, right, top, bottom } =
      builderRef.current.getBoundingClientRect();
    const { clientX: x, clientY: y } = ev;

    // Builder 외에 위치하면 Early Return
    if (checkIsInArea({ x, y }, { left, right, top, bottom })) {
      return;
    }
    // 놓게 되면 추가하기
  };

  useEffect(() => {
    window.addEventListener("mouseup", addElementHandler);

    return () => {
      window.removeEventListener("mouseup", addElementHandler);
    };
  }, [activeElement]);

  return (
    <div
      ref={builderRef}
      className="w-full border-2 h-full"
      onMouseEnter={detectSpaceHandler}
    >
      {/* Builder */}
      {elementTree.current.createReactElement(elementTree.current.root)}
    </div>
  );
};

export default Builder;
