import { describe, expect, it } from "vitest";
import { reactive } from "../reactive";

describe("reactive-test", () => {
  it("set get",() => {
    const user = { age: 10 };
    const observaed = reactive(user);
    expect(observaed).not.toBe(user);
    expect(observaed.age).toBe(10);
  })
})