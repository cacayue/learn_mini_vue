export const enum NodeType {
  INTERPOLATION,
  SIMPLE_EXPRESSION,
  ELEMENT,
  TEXT,
  ROOT
}

export type ParseContext = {
  source: string;
};
