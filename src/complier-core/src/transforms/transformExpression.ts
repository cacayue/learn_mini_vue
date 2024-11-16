import { NodeType } from '../node';

export function transformExpression(node: any) {
  if (node.type === NodeType.INTERPOLATION) {
    let processNode = processExpression(node.content);
    node.content = processNode;
  }
}
function processExpression(node: any) {
  let rawContent = node.content;
  node.content = `_ctx.${rawContent}`;
  return node;
}
