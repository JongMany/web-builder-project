export type ElementType =
  | "Button"
  | "Input"
  | "Textarea"
  | "Select"
  | "Card"
  | "Label"
  | "Text";
export interface ElementProps {
  id: string;
  type: ElementType;
  properties: Record<string, any>;
  children?: ElementProps[];
}

export interface ElementModel {}

export interface ElementViewModel {}
