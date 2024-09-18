import { createElementByElementType } from "@/lib/element/create-element-by-type";
import { determineElementColor } from "@/lib/element/determine-element-color";
import { ElementType } from "@/models/element/element.type";
import React, { ComponentProps } from "react";

export interface ElementBodyModel {
  // Define the data structure for your component
  id: string;
  type: "Body";
  properties: Record<string, any>;
  children?: ElementModel[];
}

export interface ElementModel {
  // Define the data structure for your component
  id: string;
  type: ElementType;
  properties: Record<string, any> | null;
  children?: ElementModel[] | null | string;
}

// interface IElementViewModel {
// Define methods and properties that the View will use
// }

// class ElementViewModel implements IElementViewModel {}

const componentMap = {
  Card: "section",
  Button: "button",
  Input: "input",
  Textarea: "textarea",
  Select: "select",
  Label: "label",
  Body: "body",
  Text: React.Fragment,
  // 'custom-component': CustomComponent, // 사용자 정의 컴포넌트가 있다면 추가
};

export class ElementModelTree {
  root: ElementModel = this.getInitialRoot();

  constructor() {}

  // Returns the initial root structure, used in both constructor and reset
  getInitialRoot(): ElementModel {
    return {
      id: "root",
      type: "Card",
      properties: {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflowX: "hidden",
        },
      },
      children: [],
    };
  }

  addElement(
    parentId: string,
    elementType: ElementType,
    {
      onClickHandler,
      onMouseDownHandler,
    }: {
      onClickHandler?: (e: React.MouseEvent) => void;
      onMouseDownHandler?: (e: React.MouseEvent) => void;
    }
  ) {
    const parentElement = this.findElement(parentId);
    if (parentElement) {
      const item = createElementByElementType(elementType, {
        onClickHandler,
        onMouseDownHandler,
      });
      if (Array.isArray(parentElement.children)) {
        parentElement.children.push(item);
      }
    }
  }

  removeElement(id: string) {
    if (Array.isArray(this.root.children)) {
      this.root.children = this.root.children?.filter(
        (child) => child.id !== id
      );
    }
  }

  findElement(id: string) {
    const dfs = (
      element: ElementModel | ElementBodyModel
    ): ElementModel | ElementBodyModel | null => {
      if (element.id === id) {
        return element;
      }
      if (element.children && Array.isArray(element.children)) {
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
      console.log(element.properties);
    }
  }

  updateChildren(id: string, text: string) {
    const element = this.findElement(id);
    if (element) {
      // 기존 children이 배열인지 확인
      if (Array.isArray(element.children)) {
        // 기존 텍스트 노드 찾기
        const textElement = element.children.find(
          (item) => item.type === "Text"
        );

        if (textElement) {
          // 기존 텍스트 노드가 있으면 업데이트
          textElement.children = text;
        } else {
          // 기존 텍스트 노드가 없으면 새로 생성
          element.children.push({
            id: Math.random().toString(), // 고유 ID 생성
            type: "Text",
            properties: null,
            children: text,
          });
        }
      } else {
        // children이 배열이 아닐 경우 새 배열로 텍스트 노드 추가
        element.children = [
          {
            id: Math.random().toString(), // 고유 ID 생성
            type: "Text",
            properties: null,
            children: text,
          },
        ];
      }
    }
  }

  createReactElement(
    element: ElementModel,
    {
      highlightedElementId,
      selectedElementId,
    }: { highlightedElementId: string | null; selectedElementId: string | null }
  ): React.ReactElement | null {
    const { type, properties, children } = element;

    // 텍스트 노드인 경우, React.Fragment로 감
    if (typeof children === "string") {
      return React.createElement(React.Fragment, null, children);
    }

    // 지정된 type에 따른 컴포넌트 선택
    const Component = componentMap[type];

    if (!Component) {
      console.error(`Unsupported component type: ${type}`);
      return null;
    }

    const childElements = Array.isArray(children)
      ? children.map((child) =>
          this.createReactElement(child, {
            highlightedElementId,
            selectedElementId,
          })
        )
      : null;

    if (!properties) {
      return React.createElement(Component, null, childElements);
    }

    // style 속성을 별도로 분리하여 처리
    const { style, ...restProperties } = properties;
    const isHighlighted = highlightedElementId === element.id;
    const isSelected = selectedElementId === element.id;

    const mergedStyle = determineElementColor(style, isSelected, isHighlighted);

    if (typeof Component === "string") {
      // HTML 요소일 경우에는 style 속성을 전달할 수 있음
      return React.createElement(
        Component,
        {
          ...restProperties, // 나머지 속성들을 전달
          style: mergedStyle as React.CSSProperties, // style 속성 전달
          // key: element.id,
          key: `${element.id}`,
          "data-element-id": element.id,
        },
        childElements
      );
    } else {
      // 사용자 정의 컴포넌트일 경우 style 속성을 전달하지 않음
      return React.createElement(
        Component,
        {
          ...restProperties, // 사용자 정의 컴포넌트에 나머지 속성 전달
          style: mergedStyle as React.CSSProperties, // style 속성 전달
          key: element.id,
          // "data-element-id": element.id,
        } as ComponentProps<typeof Component>,
        childElements
      );
    }
  }

  // Serialize the element tree to JSON
  serialize(): string {
    return JSON.stringify(this.root);
  }

  // Resets the tree back to the initial state
  reset() {
    this.root = this.getInitialRoot();
  }

  restoreEventHandlers({
    onClickHandler,
    onMouseDownHandler,
  }: {
    onClickHandler?: (e: React.MouseEvent) => void;
    onMouseDownHandler?: (e: React.MouseEvent) => void;
  }) {
    const restoreHandlers = (element: ElementModel) => {
      // 여기서 이벤트 핸들러를 다시 설정 (필요한 경우)
      element.properties = {
        ...element.properties,
        onClick: onClickHandler,
        onMouseDown: onMouseDownHandler,
      };

      // 자식 요소들에 대해서도 재귀적으로 복원
      if (Array.isArray(element.children)) {
        element.children.forEach((child) => restoreHandlers(child));
      }
    };

    restoreHandlers(this.root);
  }

  // Deserializes the tree from a JSON string
  deserialize(serializedData: ElementModel) {
    try {
      this.root = serializedData;
    } catch (error) {
      console.error("Failed to deserialize the data:", error);
    }
  }

  // Deep clone the element tree
  clone(): ElementModelTree {
    const clonedTree = new ElementModelTree();
    clonedTree.root = this.deepCloneElement(this.root);
    return clonedTree;
  }

  // 개별 요소 깊은 복사
  private deepCloneElement(element: ElementModel): ElementModel {
    return {
      ...element, // 얕은 복사
      properties: { ...element.properties }, // 속성 복사
      children: Array.isArray(element.children)
        ? element.children.map((child) => this.deepCloneElement(child)) // 자식 요소들을 재귀적으로 복사
        : element.children, // 텍스트일 경우 그대로 복사
    };
  }

  // Convert the element tree to an HTML string

  toHTML(element: ElementModel | null = this.root): string {
    if (!element) return "";

    // If the element has children as a string, it's likely text content
    if (typeof element.children === "string") {
      return `${element.children}`;
    }

    // Map element type to HTML tag or custom component
    const Component = componentMap[element.type] || "div"; // Default to "div" if unsupported type

    const attributes = this.generateAttributesString(element.properties);

    // Recursively process child elements
    const childrenHTML = Array.isArray(element.children)
      ? element.children.map((child) => this.toHTML(child)).join("")
      : "";

    // Return the HTML for the element
    return `<${Component}${attributes}>${childrenHTML}</${Component}>`;
  }

  private generateAttributesString(
    properties: Record<string, any> | null
  ): string {
    if (!properties) return "";

    const attributes: string[] = [];

    // Convert properties into valid HTML attributes
    for (const [key, value] of Object.entries(properties)) {
      if (typeof value === "function") {
        // Skip function properties
        continue;
      }

      if (key === "style" && typeof value === "object") {
        // Convert style object to inline style string
        const styleString = Object.entries(value)
          .map(([prop, val]) => `${this.toKebabCase(prop)}:${val}`)
          .join(";");
        attributes.push(`style="${styleString}"`);
      } else {
        // Handle other attributes
        attributes.push(`${key}="${value}"`);
      }
    }

    return attributes.length > 0 ? ` ${attributes.join(" ")}` : "";
  }

  private toKebabCase(str: string): string {
    return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  }
}
