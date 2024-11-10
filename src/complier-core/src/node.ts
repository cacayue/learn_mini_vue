export const enum NodeType {
  INTERPOLATION,
  SIMPLE_EXPRESSION,
  ELEMENT,
  TEXT
}

export type ParseContext = {
  source: string;
};
