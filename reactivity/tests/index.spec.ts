import { describe, expect, it } from 'vitest'
import { add } from '..';

it('init', () => {
  expect(true).toBe(true);
});

it('test', () => {
  expect(add(1, 2)).toEqual(3);
});
