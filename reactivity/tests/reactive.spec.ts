import { describe, expect, it } from 'vitest';
import { isProxy, isReactive, isReadonly, reactive, readonly } from '../reactive';

describe('reactive-test', () => {
  it('set get', () => {
    const user = { age: 10 };
    const observaed = reactive(user);
    expect(observaed).not.toBe(user);
    expect(observaed.age).toBe(10);
  });
  it('isReactive', () => {
    const user = { age: 10 };
    const observaed = reactive(user);
    expect(isReactive(observaed)).toBe(true);
    expect(isReactive(user)).toBe(false);
    expect(isProxy(observaed)).toBe(true);
  });

  it('nested reactive', () => {
    const orignal = {
      nested: {
        foo: 1
      },
      array: [{ bar: 2 }]
    };
    const observed = reactive(orignal);
    expect(isReactive(observed.nested)).toBe(true);
    expect(isReactive(observed.array)).toBe(true);
    expect(isReactive(observed.array[0])).toBe(true);
  });
});
