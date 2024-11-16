import { it, expect, describe } from 'vitest';
import { baseParse } from '../src/parse';
import { generateCode } from '../src/codegen';
import { transform } from '../src/transform';
import { transformExpression } from '../src/transforms/transformExpression';
import { transformElement } from '../src/transforms/transformElement';

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

  it('element', () => {
    const ast = baseParse('<div></div>');
    transform(ast, {
      nodeTransforms: [transformElement]
    });
    const { code } = generateCode(ast);

    expect(code).toMatchSnapshot();
  });
});
