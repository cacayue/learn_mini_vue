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
  validateAndGroupTags(context.source);
  return createRoot(parseChildren(context, ''));
}

function parseChildren(context: ParseContext, openTag: string) {
  let nodes = [];

  while (!isEnd(context, openTag)) {
    let node: any | undefined = undefined;
    let s = context.source.trim();

    if (s.startsWith(openDelimiter)) {
      node = parseInterpolation(context);
    } else if (s[0] === startTag) {
      if (/[a-z]/i.test(s[1])) {
        node = parseElement(context);
      }
    }

    if (!node) {
      node = parseText(context);
    }

    nodes.push(node);
  }

  function isEnd(context: ParseContext, openTag: string) {
    context.source = context.source.trim();
    if (context.source.startsWith(`</${openTag}>`)) {
      return true;
    }

    return !context.source;
  }

  return nodes;
}

function parseText(context: ParseContext) {
  let endIndex = context.source.length;

  const endTokens = [openDelimiter, startTag];

  for (let i = 0; i < endTokens.length; i++) {
    const token = endTokens[i];
    const index = context.source.indexOf(token);
    if (index !== -1 && endIndex > index) {
      endIndex = index;
    }
  }

  // 1. 获取content
  const content = parseTextData(context, endIndex);

  return {
    type: NodeType.TEXT,
    content
  };
}

function parseTextData(context: ParseContext, length: number) {
  const content = context.source.slice(0, length);

  // 2. 推进
  advanceBy(context, content.length);
  return content;
}

function parseElement(context: ParseContext) {
  context.source = context.source.trim();
  // <div></div>
  // 解析开始tag
  // 删除解析过的
  let element: any = parseTag(context, TagType.Start);
  element.children = parseChildren(context, element.tag);

  context.source = context.source.trim();

  // 再次解析结束tag
  // 删除解析过的
  parseTag(context, TagType.End);

  return element;
}

function parseTag(context: ParseContext, tagType: TagType) {
  let match = /^<\/?([a-z]*)/i.exec(context.source);
  if (!match) {
    return undefined;
  }

  let tag = match[1];
  advanceBy(context, match[0].length);
  advanceBy(context, 1);

  if (tagType === TagType.End) {
    return;
  }

  return {
    type: NodeType.ELEMENT,
    tag
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
  const rawContent = parseTextData(context, rawContentLength);

  // 推进
  advanceBy(context, closeDelimiter.length);
  const content = rawContent.trim();

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
    children: children,
    type: NodeType.ROOT
  };
}

function validateAndGroupTags(htmlString: string) {
  const regex = /<\/?[^>]+>/g;
  const matches = htmlString.match(regex);

  if (!matches) {
    return;
  }

  const groupedByType = {
    open: new Array<string>(),
    close: new Array<string>()
  };

  matches.forEach((tag: string) => {
    if (tag.startsWith('</')) {
      groupedByType.close.push(tag);
    } else {
      groupedByType.open.push(tag);
    }
  });

  if (groupedByType.open.length !== groupedByType.close.length) {
    throw Error(`有未关闭的标签`);
  }
}
