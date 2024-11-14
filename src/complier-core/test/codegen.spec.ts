import { it, expect, describe } from 'vitest';
import { baseParse } from '../src/parse';
import { generateCode } from '../src/codegen';
import { transform } from '../src/transform';

describe('codegen', () => {
  it('string', () => {
    const ast = baseParse('hi');
    transform(ast);
    const { code } = generateCode(ast);

    expect(code).toMatchSnapshot();
  });
});
