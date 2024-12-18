import { describe, expect, it, vi } from 'vitest';
import { reactive } from '../reactive';
import { effect, stop } from '../effect';

describe('effect', () => {
  it('happy path', () => {
    const user = reactive({
      age: 10
    });

    let nextAge;
    effect(() => {
      nextAge = user.age + 1;
    });
    expect(nextAge).toBe(11);

    user.age++;
    expect(nextAge).toBe(12);
  });

  it('return runner', () => {
    // 1. effect(fn) -> function(runner) -> fn -> return
    let foo = 10;
    const runner = effect(() => {
      foo++;
      return 'foo';
    });
    expect(foo).toBe(11);
    const res = runner();
    expect(foo).toBe(12);
    expect(res).toBe('foo');
  });

  it('scheduler', () => {
    let dummy;
    let run: any;
    const scheduler = vi.fn(() => {
      run = runner;
    });
    const obj = reactive({ foo: 1 });
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      { scheduler }
    );
    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1);
    // sould be called on first trigger
    obj.foo++;
    expect(scheduler).toBeCalledTimes(1);
    // should not run yet
    expect(dummy).toBe(1);
    run();
    expect(dummy).toBe(2);
  });
  it('stop', () => {
    let dummy;
    const obj = reactive({ prop: 1 });
    const runner = effect(() => {
      dummy = obj.prop;
    });
    obj.prop = 2;
    expect(dummy).toBe(2);
    stop(runner);
    obj.prop = 3;
    // obj.prop = obj.prop + 1;
    // obj.prop++;
    expect(dummy).toBe(2);
    runner();
    expect(dummy).toBe(3);
  });
  it('onstop', () => {
    let dummy: number = 0;
    const onstop = vi.fn();
    const runner = effect(
      () => {
        dummy += 1;
      },
      { onstop }
    );
    stop(runner);
    expect(onstop).toBeCalledTimes(1);
  });
});
