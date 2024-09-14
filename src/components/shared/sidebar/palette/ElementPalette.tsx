import { ElementItem } from "@/components/shared/sidebar/palette/item/ElementItem";
import { useDndElementStore } from "@/stores/dnd-element.store";
import { useEffect } from "react";
import { BsArrowDown } from "react-icons/bs";

const ElementPalette = () => {
  const { initialize } = useDndElementStore();

  useEffect(() => {
    window.addEventListener("mouseup", initialize);
    return () => {
      window.removeEventListener("mouseup", initialize);
    };
  }, []);

  return (
    <div className="select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-2 py-1 select-none">
        <h5>Base</h5>
        <BsArrowDown />
      </div>
      {/* Section */}
      <div className="grid grid-cols-[90px_90px] gap-[10px] px-3 select-none">
        <ElementItem label="Button" elementType="Button" />
        <ElementItem label="Textarea" elementType="Textarea" />
        <ElementItem label="Card" elementType="Card" />
        <ElementItem label="Input" elementType="Input" />
        <ElementItem label="Select" elementType="Select" />
        <ElementItem label="Label" elementType="Label" />
      </div>
    </div>
  );
};

export default ElementPalette;
