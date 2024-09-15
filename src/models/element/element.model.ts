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
  children?: ElementModel[];
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

  addElement(element: ElementModel) {
    this.root.children?.push(element);
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

  createReactElement(element: ElementModel): React.ReactElement | null {
    const { type, properties, children } = element;

    // 지정된 type에 따른 컴포넌트 선택
    const Component = componentMap[type];

    if (!Component) {
      console.error(`Unsupported component type: ${type}`);
      return null;
    }
    const childElements =
      children?.map((child) => this.createReactElement(child)) || null;

    return React.createElement(
      Component,
      { ...properties, key: element.id, "data-element-id": element.id },
      childElements
    );
  }
}
