import { detectClosestElementId } from "@/lib/geometry/calculate-distance";
import { checkIsInArea } from "@/lib/geometry/check-is-in-area";
import { useDndElementStore } from "@/stores/dnd-element.store";
import { useEditStatusStore } from "@/stores/edit-status.store";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

const Builder = () => {
  const { activeElement } = useDndElementStore();
  const {
    setSelectedItemId,
    elementTree,
    addElementItem,
    restoreEventHandlers,
  } = useEditStatusStore();

  const builderRef = useRef<HTMLDivElement>(null);
  // const elementTree = useRef(new ElementModelTree());

  const [closestElementId, setClosestElementId] = useState<string | null>(null);
  const [highlightedElementId, setHighlightedElementId] = useState<
    string | null
  >(null);

  // 최신 상태 값을 참조할 수 있도록 이벤트 핸들러를 ref로 관리
  const addElementHandlerRef = useRef<(ev: MouseEvent) => void>();

  // 하이라이트 처리 함수
  const highlightElement = useCallback((id: string) => {
    setHighlightedElementId(id);

    setTimeout(() => {
      setHighlightedElementId(null); // 하이라이트 해제
    }, 2000);
  }, []);

  useEffect(() => {
    if (closestElementId) {
      highlightElement(closestElementId);
    }
  }, [closestElementId, highlightElement]);

  // 공간을 감지하는 함수 (문제 해결 방법 pointer-events: none)
  const detectSpaceHandler = useCallback((event: React.MouseEvent) => {
    const activeElement = useDndElementStore.getState().activeElement;
    if (!activeElement || !builderRef.current) return;
    const { clientX: x, clientY: y } = event;
    const targetElement = event.target as HTMLElement;
    if (!targetElement.getAttribute("data-element-id")) return;

    const closestElementId = detectClosestElementId(targetElement, { x, y });
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
      addElementItem(closestElementId, activeElement, {
        onClickHandler: (e: React.MouseEvent) => {
          e.stopPropagation();
          const target = e.target as HTMLElement;
          setSelectedItemId(
            target.getAttribute("data-element-id") || closestElementId
          );
        },
        onMouseDownHandler: (e: React.MouseEvent) => {
          console.log("dragging", e);
          // detectSpaceHandler(e);
        },
      });
    }
    setClosestElementId(null);
  };

  // ref에 전역 이벤트 핸들러 업데이트
  useEffect(() => {
    addElementHandlerRef.current = addElementHandler;
  }, [closestElementId, activeElement]);

  // window 이벤트 등록
  useEffect(() => {
    const handler = (ev: MouseEvent) => addElementHandlerRef.current?.(ev);
    window.addEventListener("mouseup", handler);

    return () => {
      window.removeEventListener("mouseup", handler);
    };
  }, []);

  useLayoutEffect(() => {
    restoreEventHandlers({
      onClickHandler: (e: React.MouseEvent) => {
        e.stopPropagation();
        const target = e.target as HTMLElement;
        setSelectedItemId(
          target.getAttribute("data-element-id") || closestElementId
        );
      },
      onMouseDownHandler: (e: React.MouseEvent) => {
        console.log("dragging", e);
        // detectSpaceHandler(e);
      },
    });
  }, []);

  return (
    <div
      ref={builderRef}
      className="w-full h-full border-2"
      onMouseMove={detectSpaceHandler}
      data-element-id="root"
    >
      {/* Builder */}
      {/* {elementTree.current.createReactElement(
        elementTree.current.root,
        highlightedElementId
      )} */}
      {elementTree.createReactElement(elementTree.root, highlightedElementId)}
    </div>
  );
};

export default Builder;
