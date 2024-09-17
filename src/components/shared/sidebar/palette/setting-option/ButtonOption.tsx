import { ElementBodyModel, ElementModel } from "@/models/element/element.model";
import { useEditStatusStore } from "@/stores/edit-status.store";
import React, { useEffect, useState } from "react";

type Props = {
  selectedItem: ElementModel | ElementBodyModel;
};

export const ButtonOption = ({ selectedItem }: Props) => {
  const styles = selectedItem.properties?.style;

  const { updateProperties, updateTextElement, removeElementItem } =
    useEditStatusStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newStyles = {
      ...styles,
      [name]: value,
    };
    updateProperties(newStyles);
  };

  const pixelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const number = parseInt(value);
    const newStyles = {
      ...styles,
      [name]: `${number >= 0 ? number : 0}px`,
    };
    updateProperties(newStyles);
  };

  const textChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const removeHandler = () => {
    // TODO: 알림창 띄우면 좋을 듯
    removeElementItem();
  };

  const [text, setText] = useState(() => {
    if (Array.isArray(selectedItem.children)) {
      return (
        selectedItem.children?.filter((item) => item.type === "Text")[0]
          ?.properties?.text || ""
      );
    }
    return "";
  });

  useEffect(() => {
    updateTextElement(text);
  }, [text]);

  console.log(selectedItem, text, selectedItem.children);
  return (
    <div className="px-4 py-2 flex flex-col justify-start items-start gap-[8px]">
      <h2 className="text-[16px] font-bold">버튼 스타일</h2>
      <div className="flex items-center text-[14px]">
        <label className="min-w-[60px]">배경색</label>
        <input
          type="color"
          name="backgroundColor"
          value={styles.backgroundColor}
          onChange={handleChange}
        />
      </div>
      <div className="flex items-center text-[14px]">
        <label className="min-w-[60px]">글자색</label>
        <input
          type="color"
          name="color"
          value={styles.color}
          onChange={handleChange}
        />
      </div>
      <div className="flex items-center text-[14px]">
        <label className="min-w-[80px]">테두리 두께</label>
        <input
          type="number"
          name="borderWidth"
          className="w-[40px]"
          value={styles.borderWidth.split("px")[0]}
          onChange={pixelChange}
        />
        <span>px</span>
      </div>
      <div className="flex items-center text-[14px]">
        <label className="min-w-[80px]">테두리 굴곡</label>
        <input
          type="number"
          name="borderRadius"
          className="w-[40px]"
          value={styles.borderRadius.split("px")[0]}
          onChange={pixelChange}
        />
        <span>px</span>
      </div>
      <div className="flex items-center text-[14px]">
        <label className="min-w-[80px]">테두리 색상</label>
        <input
          type="color"
          name="borderColor"
          value={styles.borderColor}
          onChange={handleChange}
        />
      </div>
      <div className="flex items-center text-[14px]">
        <label className="min-w-[80px]">텍스트 사이즈</label>
        <input
          type="text"
          name="fontSize"
          className="w-[40px]"
          value={styles.fontSize.split("px")[0]}
          onChange={pixelChange}
        />
        <span>px</span>
      </div>
      <div className="flex items-center text-[14px]">
        <label className="min-w-[80px]">텍스트</label>
        <input
          type="text"
          className="w-[40px]"
          value={text}
          onChange={textChange}
        />
      </div>
      <div className="flex items-center text-[14px]">
        <label className="min-w-[80px]">너비</label>
        <input
          type="number"
          className="w-[40px]"
          name="width"
          value={styles.width.split("px")[0]}
          onChange={pixelChange}
        />
        <span>px</span>
      </div>
      <div className="flex items-center text-[14px]">
        <label className="min-w-[80px]">높이</label>
        <input
          type="number"
          className="w-[40px]"
          name="height"
          value={styles.height.split("px")[0]}
          onChange={pixelChange}
        />
        <span>px</span>
      </div>
      <div>
        <button onClick={removeHandler}>제거</button>
      </div>
    </div>
  );
};
