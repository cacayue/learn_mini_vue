import { NodeType } from './node';

export type TransformOptions = {
  nodeTransforms: Array<Function>;
};

export type TransformContext = {
  root: any;
  nodeTransforms: Array<Function>;
};

export function transform(root: any, options: TransformOptions) {
  const context = createTraverseContext(root, options);
  traverseNode(root, context);
}
function traverseNode(node: any, context: TransformContext) {
  let children = node.children;

  const transforms = context.nodeTransforms;

  for (let i = 0; i < transforms.length; i++) {
    const transform = transforms[i];
    transform(node);
  }

  // 1. 广度优先搜索 遍历AST
  if (children) {
    for (let i = 0; i < children.length; i++) {
      const node = children[i];
      traverseNode(node, context);
    }
  }
}
function createTraverseContext(root: any, options: TransformOptions): TransformContext {
  let context: TransformContext = {
    root,
    nodeTransforms: options.nodeTransforms || []
  };

  return context;
}
