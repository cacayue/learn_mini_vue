import { describe, expect, it, vi } from 'vitest';
import { baseParse } from '../src/parse';
import { NodeType } from '../src/node';

describe('parse', () => {
  it('interpolation', () => {
    const message = '{{message}}';
    const ast = baseParse(message);

    expect(ast.children[0]).toStrictEqual({
      type: NodeType.INTERPOLATION,
      content: {
        type: NodeType.SIMPLE_EXPRESSION,
        content: 'message'
      }
    });
  });
  it('element', () => {
    const message = '<div></div>';
    const ast = baseParse(message);

    expect(ast.children[0]).toStrictEqual({
      type: NodeType.ELEMENT,
      tag: 'div'
    });
  });
});
