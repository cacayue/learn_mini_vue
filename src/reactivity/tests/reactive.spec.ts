import { describe, expect, it } from 'vitest';
import { isProxy, isReactive, isReadonly, reactive, readonly } from '../reactive';

describe('reactive-test', () => {
  it('set get', () => {
    const user = { age: 10 };
    const observed = reactive(user);
    expect(observed).not.toBe(user);
    expect(observed.age).toBe(10);
  });
  it('isReactive', () => {
    const user = { age: 10 };
    const observed = reactive(user);
    expect(isReactive(observed)).toBe(true);
    expect(isReactive(user)).toBe(false);
    expect(isProxy(observed)).toBe(true);
  });

  it('nested reactive', () => {
    const original = {
      nested: {
        foo: 1
      },
      array: [{ bar: 2 }]
    };
    const observed = reactive(original);
    expect(isReactive(observed.nested)).toBe(true);
    expect(isReactive(observed.array)).toBe(true);
    expect(isReactive(observed.array[0])).toBe(true);
  });
});
