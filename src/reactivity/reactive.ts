import { mutableHandler, readonlyHandler, shadowReadonlyHandler } from './baseHandler';

export enum isReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly'
}

export function reactive(raw: any) {
  return createActiveProxy(raw, mutableHandler);
}

export function readonly(raw: any) {
  return createActiveProxy(raw, readonlyHandler);
}

export function shadowReadonly(raw: any) {
  return createActiveProxy(raw, shadowReadonlyHandler);
}

export function isReactive(value: any): boolean {
  return !!value[isReactiveFlags.IS_REACTIVE];
}

export function isReadonly(value: any): boolean {
  return !!value[isReactiveFlags.IS_READONLY];
}

export function isProxy(value: any) {
  return isReactive(value) || isReadonly(value);
}

function createActiveProxy(raw: any, baseHandler: any) {
  if (!raw) {
    return;
  }
  return new Proxy(raw, baseHandler);
}
