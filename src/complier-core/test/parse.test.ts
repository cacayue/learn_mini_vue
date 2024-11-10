import { describe, expect, it, vi } from 'vitest';
import { baseParse } from '../src/parse';

describe('parse', () => {
  it('interpolation', () => {
    const message = '{{message}}';
    const ast = baseParse(message);

    expect(ast.children[0]).toStrictEqual({
      type: 'interpolation',
      content: {
        type: 'simple_expression',
        content: 'message'
      }
    });
  });
});
