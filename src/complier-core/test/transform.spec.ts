import { it, expect, describe } from 'vitest';
import { baseParse } from '../src/parse';
import { NodeType } from '../src/node';
import { transform } from '../src/transform';

describe('transform', () => {
  it('happy path', () => {
    const ast = baseParse('<div>hi, {{message}}</div>');
    const plugin = (node: any) => {
      // 判断当前类型是否为指定类型
      if (node.type === NodeType.TEXT) {
        node.content = node.content + 'mini-vue';
      }
    };

    transform(ast, {
      nodeTransforms: [plugin]
    });

    const nodeText = ast.children[0].children[0];
    expect(nodeText.content).toBe('hi, mini-vue');
  });
});
