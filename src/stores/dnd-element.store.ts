import { ElementType } from "@/models/element/element.type";
import { create } from "zustand";

type State = {
  parentElementId: string | null;
  activeElement: ElementType | null;
  // position:
};

type Action = {
  setParentElementId: (id: string) => void;
  setActiveElement: (element: ElementType | null) => void;
  initialize: () => void;
  // setPosition: (position: { x: number; y: number }) => void;
};

export const useDndElementStore = create<State & Action>((set) => ({
  parentElementId: null,
  activeElement: null,
  setParentElementId: (id) => set((prev) => ({ ...prev, parentElementId: id })),
  setActiveElement: (element) =>
    set((prev) => ({ ...prev, activeElement: element })),
  initialize: () =>
    set((prev) => ({ ...prev, parentElementId: null, activeElement: null })),
}));
