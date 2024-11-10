import { NodeType, ParseContext } from './node';

const openDelimiter = '{{';
const closeDelimiter = '}}';

export function baseParse(content: string) {
  const context = createParseContext(content);

  return createRoot(parseChildren(context));
}

function parseChildren(context: ParseContext) {
  let nodes = [];

  if (context.source.startsWith(openDelimiter)) {
  }
  let node = parseInterpolation(context);

  nodes.push(node);

  return nodes;
}

function parseInterpolation(context: ParseContext) {
  // {{message}}

  // 9
  const closeIndex = context.source.indexOf(closeDelimiter, openDelimiter.length);

  // message}}
  advanceBy(context, openDelimiter.length);

  // 7
  const rawContentLength = closeIndex - closeDelimiter.length;

  // 截取0-7：  message
  const rawContent = context.source.slice(0, rawContentLength);
  const content = rawContent.trim();

  // 推进
  advanceBy(context, rawContentLength + closeDelimiter.length);
  console.log(context.source, 'close');

  return {
    type: NodeType.INTERPOLATION,
    content: {
      type: NodeType.SIMPLE_EXPRESSION,
      content: content
    }
  };
}

// 推进： 每次处理完成对应的字符后截取掉，只保留没处理的
function advanceBy(context: ParseContext, length: number) {
  context.source = context.source.slice(length);
}

function createParseContext(content: string): ParseContext {
  return {
    source: content
  };
}

function createRoot(children: any[]) {
  return {
    children: children
  };
}
