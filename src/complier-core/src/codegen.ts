import { CREATE_ELEMENT_BLOCK, helperNameMap, TO_DISPLAY_STRING } from './complierHelper';
import { NodeType } from './node';

export function generateCode(ast: any) {
  let context = createContext();
  const { push } = context;
  genFunctionPreamble(ast, context);
  const functionName = 'render';
  const args = ['_ctx', '_cache'];
  const signature = args.join(', ');
  const node = ast.codeGenNode;
  push(`function ${functionName}(${signature}) {`);

  push(`return `);
  genNode(node, context);

  push(`}`);
  return {
    code: context.code
  };
}

function genFunctionPreamble(ast: any, context: any) {
  const { push } = context;
  const VueBinging = `'vue'`;

  if (ast.helpers?.length > 0) {
    const aliasHelper = (s: string) => `${s} as _${s}`;
    push(`import { ${ast.helpers.map(aliasHelper)} } from ${VueBinging}`);
    push('\n');
  }

  push('return ');
}

function createContext() {
  const context = {
    code: '',
    push(source: string) {
      context.code += source;
    },
    helper(key: symbol) {
      return `_${helperNameMap.get(key)}`;
    }
  };
  return context;
}

function genNode(node: any, context: any) {
  const { push } = context;

  switch (node.type) {
    case NodeType.TEXT:
      genText(node, context);
      break;
    case NodeType.INTERPOLATION:
      genInterpolation(node, context);
      break;
    case NodeType.SIMPLE_EXPRESSION:
      genExpression(node, context);
      break;
    case NodeType.ELEMENT:
      genElement(node, context);
      break;
    default:
      break;
  }
}

function genElement(node: any, context: any) {
  const { push, helper } = context;
  push(`${helper(CREATE_ELEMENT_BLOCK)}(`);
  push(`${node.tag}`);
  genNodeChildren(node, context);
  push(`)`);
}

function genNodeChildren(node: any, context: any) {
  const { push } = context;
  if (node.children.length > 0) {
    push(`,null,`);
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      console.log(child, 'child');
      genNode(child, context);
      if (i + 1 < node.children.length) {
        push(` + `);
      }
    }
    push(`, 1 /* TEXT */`);
  }
}

function genText(node: any, context: any) {
  const { push } = context;
  push(`"${node.content}"`);
}

function genInterpolation(node: any, context: any) {
  const { push, helper } = context;
  push(`${helper(TO_DISPLAY_STRING)}(`);
  genNode(node.content, context);
  push(`)`);
}
function genExpression(node: any, context: any) {
  const { push } = context;
  push(`${node.content}`);
}
