import { ElementType } from "@/models/element/element.type";
import React from "react";

interface ElementBodyModel {
  // Define the data structure for your component
  id: string;
  type: "Body";
  properties: Record<string, any>;
  children?: ElementModel[];
}

interface ElementModel {
  // Define the data structure for your component
  id: string;
  type: ElementType;
  properties: Record<string, any>;
  children?: ElementModel[] | null;
}

interface IElementViewModel {
  // Define methods and properties that the View will use
}

class ElementViewModel implements IElementViewModel {}

const componentMap = {
  Card: "section",
  Button: "button",
  Input: "input",
  Textarea: "textarea",
  Select: "select",
  Label: "label",
  Body: "body",
  // 'custom-component': CustomComponent, // 사용자 정의 컴포넌트가 있다면 추가
};

export class ElementModelTree {
  root: ElementModel = {
    id: "root",
    type: "Card", // 'Body'
    properties: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      },
    },
    children: [],
  };

  constructor() {}

  addElement(parentId: string, elementType: ElementType) {
    const parentElement = this.findElement(parentId);
    if (parentElement) {
      parentElement.children?.push(createElementByElementType(elementType));
      console.log(parentElement);
    }
    // this.root.children?.push(element);
  }

  removeElement(id: string) {
    this.root.children = this.root.children?.filter((child) => child.id !== id);
  }

  findElement(id: string) {
    const dfs = (
      element: ElementModel | ElementBodyModel
    ): ElementModel | ElementBodyModel | null => {
      if (element.id === id) {
        return element;
      }
      if (element.children) {
        for (const child of element.children) {
          const result = dfs(child);
          if (result) {
            return result;
          }
        }
      }
      return null;
    };
    return dfs(this.root);
  }

  updateElementProperties(
    id: string,
    properties: Partial<Record<string, any>>
  ) {
    const element = this.findElement(id);
    if (element) {
      element.properties = { ...element.properties, ...properties };
    }
  }

  createReactElement(
    element: ElementModel,
    highlightedElementId: string | null
  ): React.ReactElement | null {
    const { type, properties, children } = element;

    // 지정된 type에 따른 컴포넌트 선택
    const Component = componentMap[type];

    if (!Component) {
      console.error(`Unsupported component type: ${type}`);
      return null;
    }

    const childElements =
      children?.map((child) =>
        this.createReactElement(child, highlightedElementId)
      ) || null;

    const isHighlighted = highlightedElementId === element.id;
    const style = isHighlighted
      ? {
          ...properties.style,
          border: "2px solid red", // 하이라이트 스타일
        }
      : properties.style;

    return React.createElement(
      Component,
      { ...properties, style, key: element.id, "data-element-id": element.id },
      childElements
    );
  }

  highlightElement(id: string) {
    const element = this.findElement(id);
    const originalStyle = element?.properties.style;

    if (element) {
      console.log(element, originalStyle);
      element.properties.style = {
        ...originalStyle,
        border: "2px solid red",
      };

      setTimeout(() => {
        element.properties.style = originalStyle;
      }, 10);
    }
  }
}

function createElementByElementType(elementType: ElementType) {
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
        },
        children: [],
      };
    case "Button":
    case "Select":
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
        },
        children: [],
      };
  }
}
