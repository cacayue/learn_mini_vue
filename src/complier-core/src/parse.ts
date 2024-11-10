import { NodeType, ParseContext } from './node';

const openDelimiter = '{{';
const closeDelimiter = '}}';
const startTag = '<';

const enum TagType {
  Start,
  End
}

export function baseParse(content: string) {
  const context = createParseContext(content);

  return createRoot(parseChildren(context));
}

function parseChildren(context: ParseContext) {
  let nodes = [];

  let node: any | undefined = {};
  let s = context.source;
  if (s.startsWith(openDelimiter)) {
    node = parseInterpolation(context);
  } else if (s[0] === startTag) {
    if (/[a-z]/i.test(s[1])) {
      node = parseElement(context);
    }
  }

  nodes.push(node);

  return nodes;
}

function parseElement(context: ParseContext) {
  // <div></div>
  // 解析开始tag
  // 删除解析过的
  let element = parseTag(context, TagType.Start);

  // 再次解析结束tag
  // 删除解析过的
  parseTag(context, TagType.End);

  return element;
}

function parseTag(context: ParseContext, tagType: TagType) {
  let match = /^<\/?([a-z]*)/i.exec(context.source);
  if (!match) {
    return {};
  }
  console.log('1. match ', context.source);

  let tag = match[1];
  advanceBy(context, match[0].length);
  advanceBy(context, 1);
  console.log('2. advanceBy ', context.source);

  if (tagType === TagType.End) {
    return;
  }

  return {
    type: NodeType.ELEMENT,
    tag: tag
  };
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
  console.log(context.source, 'parseInterpolation --- close');

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