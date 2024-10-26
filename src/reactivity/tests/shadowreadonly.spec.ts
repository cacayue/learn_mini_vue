import { describe, expect, it } from 'vitest';
import { isReadonly, shadowReadonly } from '../reactive';

describe('shadow readonly', () => {
  it('should not make non-reactive props reactive', () => {
    const props = shadowReadonly({ n: { foo: 1 } });
    expect(isReadonly(props)).toBe(true);
    expect(isReadonly(props.n)).not.toBe(true);
  });
});
