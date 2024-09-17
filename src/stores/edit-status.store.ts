import { EditStatus } from "@/models/edit-type/edit-status.type";
import { ElementModelTree } from "@/models/element/element.model";
import { ElementType } from "@/models/element/element.type";
import { create } from "zustand";
import { persist } from "zustand/middleware";
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
  addElementItem: (
    parentId: string,
    elementType: ElementType,
    {
      onClickHandler,
      onMouseDownHandler,
    }: {
      onClickHandler?: (e: React.MouseEvent) => void;
      onMouseDownHandler?: (e: React.MouseEvent) => void;
    }
  ) => void;
  restoreEventHandlers: (handlers: {
    onClickHandler: (e: React.MouseEvent) => void;
    onMouseDownHandler: (e: React.MouseEvent) => void;
  }) => void;
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
// export const useEditStatusStore = create<State & Action>((set) => ({
//   editStatus: "Element",
//   selectedItemId: null,
//   elementTree: new ElementModelTree(),
//   changeElementState: () => set({ editStatus: "Element" }),
//   changeSettingState: () => set({ editStatus: "Setting" }),
//   setSelectedItemId: (id) => set({ selectedItemId: id }),
//   updateProperties: (properties) => {
//     const { selectedItemId, elementTree } = useEditStatusStore.getState();
//     console.log(selectedItemId, elementTree);

//     if (selectedItemId) {
//       const updatedElementTree = elementTree.clone(); // 기존 트리를 복제하여 새로운 객체 생성
//       updatedElementTree.updateElementProperties(selectedItemId, {
//         style: properties,
//       });

//       set({ elementTree: updatedElementTree }); // 상태 변경을 명시적으로 호출
//     }
//   },
//   removeElementItem: () => {
//     const { selectedItemId, elementTree } = useEditStatusStore.getState();
//     if (selectedItemId) {
//       const updatedElementTree = elementTree.clone();
//       updatedElementTree.removeElement(selectedItemId);
//       set({ elementTree: updatedElementTree });
//     }
//   },
//   updateTextElement: (text: string) => {
//     const { selectedItemId, elementTree } = useEditStatusStore.getState();

//     if (selectedItemId) {
//       const updatedElementTree = elementTree.clone();

//       updatedElementTree.updateChildren(selectedItemId, text);
//       console.log(updatedElementTree, text);
//       set({ elementTree: updatedElementTree }); // 상태 변경을 명시적으로 호출
//     }
//   },
//   // ElementModelTree를 설정할 때, JSON으로 직렬화 가능한 데이터로 변환하여 저장
//   // setElementTree: (data) => {
//   //   const elementTree = ElementModelTree.fromJSON(data); // 복원 로직
//   //   set({ elementTree });
//   // },
// }));

export const useEditStatusStore = create(
  persist<State & Action>(
    (set, get) => ({
      editStatus: "Element",
      selectedItemId: null,
      elementTree: new ElementModelTree(),

      // Actions
      changeElementState: () => set({ editStatus: "Element" }),
      changeSettingState: () => set({ editStatus: "Setting" }),
      setSelectedItemId: (id) => {
        if (id !== "root") set({ selectedItemId: id });
      },

      updateProperties: (properties) => {
        const { selectedItemId, elementTree } = get();

        if (selectedItemId) {
          const updatedElementTree = elementTree.clone();
          updatedElementTree.updateElementProperties(selectedItemId, {
            style: properties,
          });

          set({ elementTree: updatedElementTree });
        }
      },

      updateTextElement: (text) => {
        const { selectedItemId, elementTree } = get();

        if (selectedItemId) {
          const updatedElementTree = elementTree.clone();
          updatedElementTree.updateChildren(selectedItemId, text);
          set({ elementTree: updatedElementTree });
        }
      },

      removeElementItem: () => {
        const { selectedItemId, elementTree } = get();

        if (selectedItemId) {
          const updatedElementTree = elementTree.clone();
          updatedElementTree.removeElement(selectedItemId);
          set({ elementTree: updatedElementTree });
        }
      },
      addElementItem: (
        parentId,
        elementType,
        { onClickHandler, onMouseDownHandler }
      ) => {
        const { elementTree } = get();
        const updatedElementTree = elementTree.clone();
        updatedElementTree.addElement(parentId, elementType, {
          onClickHandler,
          onMouseDownHandler,
        });
        set({ elementTree: updatedElementTree });
      },
      restoreEventHandlers: (handlers) => {
        const { elementTree } = get();
        const updatedElementTree = elementTree.clone();
        updatedElementTree.restoreEventHandlers(handlers);
        set({ elementTree: updatedElementTree });
      },
    }),
    {
      name: "edit-status",
      storage: {
        getItem: (name) => {
          const data = localStorage.getItem(name);
          console.log("getItem", data);
          if (data) {
            const parsedData = JSON.parse(data);
            if (parsedData?.state?.elementTree?.root) {
              console.log(parsedData.state.elementTree);

              const root = parsedData.state.elementTree.root;
              // Reconstruct the ElementModelTree
              const elementTree = new ElementModelTree();
              elementTree.deserialize(root); // Deserialize the root
              parsedData.state.elementTree = elementTree;
              parsedData.state.selectedItemId = null;
              return parsedData;
            }
          }
          return null;
        },
        setItem: (name, state) => {
          // Serialize the elementTree before storing
          console.log("name", name, state);
          const serializedState = {
            ...state,
            elementTree: state.state.elementTree.serialize(),
          };
          console.log(serializedState);
          localStorage.setItem(name, JSON.stringify(serializedState));
        },
        removeItem: (name) => {
          console.log("removeItem", name);

          localStorage.removeItem(name);
        },
      },
    }
  )
);
