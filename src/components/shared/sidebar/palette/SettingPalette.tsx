import { SettingOption } from "@/components/shared/sidebar/palette/setting-option";
import { useEditStatusStore } from "@/stores/edit-status.store";

const SettingPalette = () => {
  const { selectedItemId, elementTree } = useEditStatusStore();
  if (selectedItemId === null) return null;

  const selectedItem = elementTree.findElement(selectedItemId);
  if (!selectedItem) return null;

  return <SettingOption selectedItem={selectedItem} />;
};

export default SettingPalette;
