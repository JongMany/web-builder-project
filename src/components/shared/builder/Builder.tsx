import { checkIsInArea } from "@/lib/check-is-in-area";
import { useDndElementStore } from "@/stores/dnd-element.store";
import { MouseEvent as ReactMouseEvent, useEffect, useRef } from "react";

const Builder = () => {
  const { activeElement } = useDndElementStore();
  const builderRef = useRef<HTMLDivElement>(null);

  // 공간을 감지하는 함수
  const detectSpaceHandler = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!activeElement) return;

    console.log("detect Space!", activeElement, event.clientX, event.clientY);
  };

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
      {}
    </div>
  );
};

export default Builder;
