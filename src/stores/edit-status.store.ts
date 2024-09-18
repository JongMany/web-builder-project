import { EditStatus } from "@/models/edit-type/edit-status.type";
import { ElementModelTree } from "@/models/element/element.model";
import { ElementType } from "@/models/element/element.type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  resetElementTree: () => void;
};

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
      resetElementTree: () => {
        set({ elementTree: new ElementModelTree() });
      },
    }),
    {
      name: "edit-status",
      storage: {
        getItem: (name) => {
          const data = localStorage.getItem(name);
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
          localStorage.setItem(name, JSON.stringify(serializedState));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);
