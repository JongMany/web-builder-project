import { EditStatus } from "@/models/edit-type/edit-status.type";
import { ElementModelTree } from "@/models/element/element.model";
import { create } from "zustand";
// import { createJSONStorage, persist } from "zustand/middleware";

type State = {
  editStatus: EditStatus;
  selectedItemId: string | null;
  elementTree: ElementModelTree;
};

type Action = {
  changeElementState: () => void;
  changeSettingState: () => void;
  setSelectedItemId: (id: string | null) => void;
  updateProperties: (properties: Record<string, any>) => void;
  updateTextElement: (text: string) => void;
  removeElementItem: () => void;
};

// export const useEditStatusStore = create(
//   persist<State & Action>(
//     (set) => ({
//       editStatus: "Element",
//       selectedItemId: null,
//       elementTree: new ElementModelTree(),
//       changeElementState: () => set({ editStatus: "Element" }),
//       changeSettingState: () => set({ editStatus: "Setting" }),
//       setSelectedItemId: (id) => set({ selectedItemId: id }),
//       // ElementModelTree를 설정할 때, JSON으로 직렬화 가능한 데이터로 변환하여 저장
//       // setElementTree: (data) => {
//       //   const elementTree = ElementModelTree.fromJSON(data); // 복원 로직
//       //   set({ elementTree });
//       // },
//     }),
//     {
//       name: "edit-status",
//       storage: createJSONStorage(() => localStorage),
//     }
//   )
// );
export const useEditStatusStore = create<State & Action>((set) => ({
  editStatus: "Element",
  selectedItemId: null,
  elementTree: new ElementModelTree(),
  changeElementState: () => set({ editStatus: "Element" }),
  changeSettingState: () => set({ editStatus: "Setting" }),
  setSelectedItemId: (id) => set({ selectedItemId: id }),
  updateProperties: (properties) => {
    const { selectedItemId, elementTree } = useEditStatusStore.getState();
    console.log(selectedItemId, elementTree);

    if (selectedItemId) {
      const updatedElementTree = elementTree.clone(); // 기존 트리를 복제하여 새로운 객체 생성
      updatedElementTree.updateElementProperties(selectedItemId, {
        style: properties,
      });

      set({ elementTree: updatedElementTree }); // 상태 변경을 명시적으로 호출
    }
  },
  removeElementItem: () => {
    const { selectedItemId, elementTree } = useEditStatusStore.getState();
    if (selectedItemId) {
      const updatedElementTree = elementTree.clone();
      updatedElementTree.removeElement(selectedItemId);
      set({ elementTree: updatedElementTree });
    }
  },
  updateTextElement: (text: string) => {
    const { selectedItemId, elementTree } = useEditStatusStore.getState();

    if (selectedItemId) {
      const updatedElementTree = elementTree.clone();

      updatedElementTree.updateChildren(selectedItemId, text);
      console.log(updatedElementTree, text);
      set({ elementTree: updatedElementTree }); // 상태 변경을 명시적으로 호출
    }
  },
  // ElementModelTree를 설정할 때, JSON으로 직렬화 가능한 데이터로 변환하여 저장
  // setElementTree: (data) => {
  //   const elementTree = ElementModelTree.fromJSON(data); // 복원 로직
  //   set({ elementTree });
  // },
}));
