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
        tag: 'div',
        children: []
      });
    });
  });

  describe('text', () => {
    it('simple text', () => {
      const message = 'some text';
      const ast = baseParse(message);

      expect(ast.children[0]).toStrictEqual({
        type: NodeType.TEXT,
        content: message
      });
    });
  });

  it('complete test', () => {
    const message = '<p>hi, {{message}}</p>';
    const ast = baseParse(message);

    expect(ast.children[0]).toStrictEqual({
      type: NodeType.ELEMENT,
      tag: 'p',
      children: [
        {
          type: NodeType.TEXT,
          content: 'hi, '
        },
        {
          type: NodeType.INTERPOLATION,
          content: {
            type: NodeType.SIMPLE_EXPRESSION,
            content: 'message'
          }
        }
      ]
    });
  });

  it('nested test', () => {
    const message = '<div><p>hi, </p>{{message}}</div>';
    const ast = baseParse(message);

    expect(ast.children[0]).toStrictEqual({
      type: NodeType.ELEMENT,
      tag: 'div',
      children: [
        {
          type: NodeType.ELEMENT,
          tag: 'p',
          children: [
            {
              type: NodeType.TEXT,
              content: 'hi, '
            }
          ]
        },
        {
          type: NodeType.INTERPOLATION,
          content: {
            type: NodeType.SIMPLE_EXPRESSION,
            content: 'message'
          }
        }
      ]
    });
  });

  it('throw a error when lack tag', () => {
    expect(() => {
      const message = '<div><p>hi</div>';
      const ast = baseParse(message);
    }).toThrow();
  });
});
