import SettingPalette from "@/components/shared/sidebar/palette/SettingPalette";
import ElementPalette from "./palette/ElementPalette";
import { useEditStatusStore } from "@/stores/edit-status.store";

export const Sidebar = () => {
  const { editStatus, changeElementState, changeSettingState } =
    useEditStatusStore();
  return (
    <aside className="w-[224px] min-w-[224px] h-full border-[1px]">
      <nav className="border-b-[1px]">
        <ul className="flex gap-x-1">
          <li onClick={changeElementState}>Components</li>
          <li onClick={changeSettingState}>Settings</li>
        </ul>
      </nav>
      <section>{editStatus === "Element" && <ElementPalette />}</section>
      <section>{editStatus === "Setting" && <SettingPalette />}</section>
    </aside>
  );
};
