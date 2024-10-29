export const extend = Object.assign;

export function isObject(params: any) {
  return params !== null && typeof params === 'object';
}

export function hasChanged(value: any, newValue: any) {
  return !Object.is(value, newValue);
}

export function hasOwn(obj: any, key: string): boolean {
  return obj && Object.prototype.hasOwnProperty.call(obj, key);
}
