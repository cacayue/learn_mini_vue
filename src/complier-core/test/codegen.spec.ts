import { it, expect, describe } from 'vitest';
import { baseParse } from '../src/parse';
import { generateCode } from '../src/codegen';
import { transform } from '../src/transform';
import { transformExpression } from '../src/transforms/transformExpression';

describe('codegen', () => {
  it('string', () => {
    const ast = baseParse('hi');
    transform(ast);
    const { code } = generateCode(ast);

    expect(code).toMatchSnapshot();
  });

  it('interpolation', () => {
    const ast = baseParse('{{message}}');
    transform(ast, {
      nodeTransforms: [transformExpression]
    });
    const { code } = generateCode(ast);

    expect(code).toMatchSnapshot();
  });
});
