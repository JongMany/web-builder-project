import { ElementType } from "@/models/element/element.type";
import { useDndElementStore } from "@/stores/dnd-element.store";
import { useEffect, useState } from "react";

type Props = {
  label: string;
  elementType: ElementType | null;
};

export const ElementItem = ({ label, elementType }: Props) => {
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const { activeElement, setActiveElement } = useDndElementStore();

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (activeElement === null) return;
      if (dragging) {
        // 마우스가 움직이는 동안 현재 위치 기록
        setCurrentPosition({ x: e.clientX, y: e.clientY });
      }
    };

    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
    };
  }, [activeElement]);

  useEffect(() => {
    const up = () => {
      setDragging(false);
      setCurrentPosition({ x: 0, y: 0 });
      setStartPosition({ x: 0, y: 0 });
    };

    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mouseup", up);
    };
  }, []);

  return (
    <div
      className="px-2 rounded-md border-2 w-full h-[90px] cursor-pointer relative"
      onMouseDown={(event) => {
        setStartPosition({ x: event.clientX, y: event.clientY });
        setDragging(true);
        setActiveElement(elementType);
      }}
    >
      {label}
      {activeElement === elementType && (
        <div
          className="px-2 rounded-md border-2 opacity-40 w-[90px] h-[90px] absolute"
          style={{
            left: currentPosition.x - startPosition.x,
            top: currentPosition.y - startPosition.y,
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};
