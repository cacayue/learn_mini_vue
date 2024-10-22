import { describe, expect, it } from "vitest";
import { isReactive, isReadonly, reactive, readonly } from "../reactive";

describe("reactive-test", () => {
  it("set get",() => {
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
  });
})