import { NodeType } from './node';

export function transform(root: any) {
  traverseNode(root);
}
function traverseNode(node: any) {
  let children = node.children;

  // 判断当前类型是否为指定类型
  if (node.type === NodeType.TEXT) {
    node.content = node.content + 'mini-vue';
  }

  // 1. 广度优先搜索 遍历AST
  if (children) {
    for (let i = 0; i < children.length; i++) {
      const node = children[i];
      traverseNode(node);
    }
  }
}
