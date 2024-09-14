import { EditStatus } from "@/models/edit-type/edit-status.type";
import { create } from "zustand";

type State = {
  editStatus: EditStatus;
};

type Action = {
  changeElementState: () => void;
  changeSettingState: () => void;
};

export const useEditStatusStore = create<State & Action>((set) => ({
  editStatus: "Element",
  changeElementState: () => set({ editStatus: "Element" }),
  changeSettingState: () => set({ editStatus: "Setting" }),
}));
