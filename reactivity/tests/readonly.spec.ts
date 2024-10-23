import { describe, expect, it, vi } from 'vitest';
import { isReadonly, readonly } from '../reactive';
import { effect } from '../effect';

describe('readonly', () => {
  it('readonly path', () => {
    const user = readonly({
      age: 10
    });

    let nextAge;
    effect(() => {
      nextAge = user.age + 1;
    });
    expect(nextAge).toBe(11);

    user.age++;
    expect(nextAge).toBe(11);
  });
  it('warn then call set', () => {
    console.warn = vi.fn();

    const user = readonly({
      age: 10
    });

    user.age = 11;
    expect(console.warn).toBeCalled();
  });

  it('isReadOnly', () => {
    const user = { age: 10 };
    const observaed = readonly(user);
    expect(isReadonly(user)).toBe(false);
    expect(isReadonly(observaed)).toBe(true);
  });

  it('nested readonly', () => {
    const orignal = {
      nested: {
        foo: 1
      },
      array: [{ bar: 2 }]
    };
    const observed = readonly(orignal);
    expect(isReadonly(observed.nested)).toBe(true);
    expect(isReadonly(observed.array)).toBe(true);
    expect(isReadonly(observed.array[0])).toBe(true);
  });
});
