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
  describe('element', () => {
    it('simple element a div', () => {
      const message = '<div></div>';
      const ast = baseParse(message);

      expect(ast.children[0]).toStrictEqual({
        type: NodeType.ELEMENT,
        tag: 'div'
      });
    });
  });

  describe('text', () => {
    it('simple text', () => {
      const message = '<div></div>';
      const ast = baseParse(message);

      expect(ast.children[0]).toStrictEqual({
        type: NodeType.ELEMENT,
        tag: 'div'
      });
    });
  });
});
