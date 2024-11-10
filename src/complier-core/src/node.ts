export const enum NodeType {
  INTERPOLATION,
  SIMPLE_EXPRESSION,
  ELEMENT
}

export type ParseContext = {
  source: string;
};
