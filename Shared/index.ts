export const extend = Object.assign;

export function isObject(params: any) {
  return params !== null && typeof params === 'object';
}
