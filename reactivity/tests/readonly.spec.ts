import { describe, expect, it, vi } from "vitest";
import { reactive, readonly } from "../reactive";
import { effect, stop } from "../effect";

 describe("readonly", () => {
  it("readonly path", () => {
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
    console.warn = vi.fn()

    const user = readonly({
      age: 10
    });

    user.age = 11;
    expect(console.warn).toBeCalled();
  })
 })