import { it, expect, describe } from 'vitest';
import { baseParse } from '../src/parse';
import { NodeType } from '../src/node';
import { transform } from '../src/transform';

describe('transform', () => {
  it('happy path', () => {
    const ast = baseParse('<div>hi, {{message}}</div>');
    transform(ast);

    const nodeText = ast.children[0].children[0];
    expect(nodeText.content).toBe('hi, mini-vue');
  });
});
