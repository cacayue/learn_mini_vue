import { helperNameMap, TO_DISPLAY_STRING } from './complierHelper';
import { NodeType } from './node';

export type TransformOptions = {
  nodeTransforms: Array<Function>;
};

export type TransformContext = {
  root: any;
  nodeTransforms: Array<Function>;
  helpers: Array<string>;
  helper: Function;
};

export function transform(root: any, options?: TransformOptions) {
  const context = createTraverseContext(root, options);
  traverseNode(root, context);

  createRootCodegen(root);

  root.helpers = [...context.helpers];
}

function createRootCodegen(root: any) {
  root.codeGenNode = root.children[0];
}

function traverseNode(node: any, context: TransformContext) {
  const transforms = context.nodeTransforms;

  for (let i = 0; i < transforms.length; i++) {
    const transform = transforms[i];
    transform(node);
  }

  switch (node.type) {
    case NodeType.INTERPOLATION:
      context.helper(helperNameMap.get(TO_DISPLAY_STRING));
      break;
    case NodeType.ROOT:
    case NodeType.ELEMENT:
      traverseChildren(node, context);
      break;
    default:
      break;
  }
}

// 1. 广度优先搜索 遍历AST
function traverseChildren(node: any, context: TransformContext) {
  let children = node.children;
  if (children) {
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      traverseNode(child, context);
    }
  }
}

function createTraverseContext(root: any, options?: TransformOptions): TransformContext {
  let context: TransformContext = {
    root,
    nodeTransforms: options?.nodeTransforms || [],
    helpers: [],
    helper: (s: string) => {
      context.helpers.push(s);
    }
  };

  return context;
}
