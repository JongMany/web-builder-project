import { checkIsInArea } from "@/lib/geometry/check-is-in-area";
import { ElementModelTree } from "@/models/element/element.model";
import { useDndElementStore } from "@/stores/dnd-element.store";
import { useCallback, useEffect, useRef, useState } from "react";

const Builder = () => {
  const { activeElement } = useDndElementStore();
  const builderRef = useRef<HTMLDivElement>(null);
  const elementTree = useRef(new ElementModelTree());
  const [closestElementId, setClosestElementId] = useState<string | null>(null);

  // 최신 상태 값을 참조할 수 있도록 이벤트 핸들러를 ref로 관리
  const addElementHandlerRef = useRef<(ev: MouseEvent) => void>();

  const detectClosestElementId = (
    parentElement: HTMLElement,
    mouseX: number,
    mouseY: number
  ) => {
    const rect = parentElement.getBoundingClientRect();
    const { top, bottom, left, right } = rect;

    if (
      !checkIsInArea({ x: mouseX, y: mouseY }, { top, bottom, left, right })
    ) {
      return null;
    }
    console.log("parentElement", parentElement);

    return parentElement.getAttribute("data-element-id") || null;
  };
  // 공간을 감지하는 함수
  const detectSpaceHandler = useCallback((event: React.MouseEvent) => {
    const activeElement = useDndElementStore.getState().activeElement;
    if (!activeElement || !builderRef.current) return;
    const { clientX: x, clientY: y } = event;
    const targetElement = event.target as HTMLElement;
    if (!targetElement.getAttribute("data-element-id")) return;

    const closestElementId = detectClosestElementId(targetElement, x, y);

    setClosestElementId(closestElementId);
  }, []);

  // 추가해주는 함수
  const addElementHandler = (ev: MouseEvent) => {
    if (!builderRef.current) return;
    const { left, right, top, bottom } =
      builderRef.current.getBoundingClientRect();
    const { clientX: x, clientY: y } = ev;

    // Builder 외에 위치하면 Early Return
    if (!checkIsInArea({ x, y }, { left, right, top, bottom })) {
      setClosestElementId(null);
      return;
    }

    if (activeElement && closestElementId) {
      elementTree.current.addElement(closestElementId, activeElement);
    }
    setClosestElementId(null);
  };

  // ref에 이벤트 핸들러 업데이트
  useEffect(() => {
    addElementHandlerRef.current = addElementHandler;
  }, [closestElementId, activeElement]);

  // 이벤트 등록
  useEffect(() => {
    const handler = (ev: MouseEvent) => addElementHandlerRef.current?.(ev);

    window.addEventListener("mouseup", handler);

    return () => {
      window.removeEventListener("mouseup", handler);
    };
  }, []);

  return (
    <div
      ref={builderRef}
      className="w-full border-2 h-full"
      onMouseMove={detectSpaceHandler}
      // onMouseUp={() => {}}
      // onMouseEnter={detectSpaceHandler}
      data-element-id="root"
    >
      {/* Builder */}
      {elementTree.current.createReactElement(elementTree.current.root)}
    </div>
  );
};

export default Builder;
