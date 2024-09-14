import { useDndElementStore } from "@/stores/dnd-element.store";
import { MouseEvent as ReactMouseEvent, useEffect, useRef } from "react";

const Builder = () => {
  const { activeElement } = useDndElementStore();
  const builderRef = useRef<HTMLDivElement>(null);

  const detectSpaceHandler = (event: ReactMouseEvent<HTMLDivElement>) => {
    console.log("activeElement", activeElement);
    if (!activeElement) return;

    console.log("detect Space!", activeElement, event.clientX, event.clientY);
  };
  const attachElementHandler = (ev: MouseEvent) => {
    if (!builderRef.current) return;
    const rect = builderRef.current.getBoundingClientRect();
    const { clientX: x, clientY: y } = ev;

    // Builder 외에 위치하면 Early Return
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      return;
    }
  };

  useEffect(() => {
    window.addEventListener("mouseup", attachElementHandler);

    return () => {
      window.removeEventListener("mouseup", attachElementHandler);
    };
  }, [activeElement]);

  return (
    <div
      ref={builderRef}
      className="w-full border-2 h-full"
      onMouseEnter={detectSpaceHandler}
    ></div>
  );
};

export default Builder;
