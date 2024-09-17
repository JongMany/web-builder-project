import { ElementType } from "@/models/element/element.type";

export function createElementByElementType(
  elementType: ElementType,
  {
    onClickHandler, // 추가
    onMouseDownHandler, // 추가
  }: {
    onClickHandler?: (e: React.MouseEvent) => void;
    onMouseDownHandler?: (e: React.MouseEvent) => void;
  }
) {
  switch (elementType) {
    case "Input":
    case "Textarea":
      return {
        type: elementType,
        id: Math.random().toString(),
        "data-element-id": Math.random().toString(),
        properties: {
          style: {
            width: "100px",
            height: "50px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "1px solid #000",
            pointerEvents: "auto",
            position: "relative",
          },
          onClick: onClickHandler, // 추가
          onMouseDown: onMouseDownHandler, // 추가
        },
        children: null,
      };
    case "Card":
      return {
        type: elementType,
        id: Math.random().toString(),
        "data-element-id": Math.random().toString(),
        properties: {
          style: {
            width: "100%",
            height: "50px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "1px solid #000",
            pointerEvents: "auto",
            position: "relative",
          },
          onClick: onClickHandler, // 추가
          onMouseDown: onMouseDownHandler, // 추가
        },
        children: [],
      };
    case "Button":
      return {
        type: elementType,
        id: Math.random().toString(),
        "data-element-id": Math.random().toString(),
        properties: {
          style: {
            width: "100px",
            height: "50px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderColor: "#000",
            borderWidth: "1px",
            borderStyle: "solid",
            pointerEvents: "auto",
            position: "relative",
            borderRadius: "0",
            backgroundColor: "#fff",
            color: "#000",
            fontSize: "16px",
          },
          onClick: onClickHandler, // 추가
          onMouseDown: onMouseDownHandler, // 추가
        },
        children: [],
      };
    case "Select":
      return {
        type: elementType,
        id: Math.random().toString(),
        "data-element-id": Math.random().toString(),
        properties: {
          style: {
            width: "100px",
            height: "50px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "1px solid #000",
            pointerEvents: "auto",
            position: "relative",
          },
          onClick: onClickHandler, // 추가
          onMouseDown: onMouseDownHandler, // 추가
        },
        children: [],
      };
    case "Label":
      return {
        type: elementType,
        id: Math.random().toString(),
        "data-element-id": Math.random().toString(),
        properties: {
          style: {
            width: "100px",
            height: "50px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "1px solid #000",
            pointerEvents: "auto",
            position: "relative",
          },
          onClick: onClickHandler, // 추가
          onMouseDown: onMouseDownHandler, // 추가
        },
        children: [],
      };
    case "Text":
      return {
        type: elementType,
        id: Math.random().toString(),
        "data-element-id": null,
        properties: null,
        children: null,
      };
  }
}
