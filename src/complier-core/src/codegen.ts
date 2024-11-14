export function generateCode(ast: any) {
  let context = createContext();
  const { push } = context;

  const functionName = 'render';
  const args = ['_ctx', '_cache'];
  const signature = args.join(', ');
  const node = ast.codeGenNode;
  push(`function ${functionName}(${signature}) {`);

  genNode(node.content, context);

  push(`}`);
  return {
    code: context.code
  };
}

function createContext() {
  const context = {
    code: 'return ',
    push(source: string) {
      context.code += source;
    }
  };
  return context;
}

function genNode(node: string, context: any) {
  const { push } = context;
  push(`return ${node}`);
}
