import { helperNameMap, TO_DISPLAY_STRING } from './complierHelper';
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
  push(`return `);
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
    default:
      break;
  }
}

function genText(node: any, context: any) {
  const { push } = context;
  push(`${node.content}`);
}

function genInterpolation(node: any, context: any) {
  const { push, helper } = context;
  console.log(node.content);
  push(`${helper(TO_DISPLAY_STRING)}(`);
  genNode(node.content, context);
  push(`)`);
}
function genExpression(node: any, context: any) {
  const { push } = context;
  push(`${node.content}`);
}
