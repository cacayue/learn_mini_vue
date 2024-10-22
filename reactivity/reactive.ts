import { mutableHandler, readonlyHandler } from "./baseHandler";

export enum isReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
}

export function reactive(raw: any) {
  return createActiveProxy(raw, mutableHandler);
}

export function readonly(raw: any) {
  return createActiveProxy(raw, readonlyHandler);
}

export function isReactive(value: any): boolean{
  return !!value[isReactiveFlags.IS_REACTIVE];
}

export function isReadonly(value: any): boolean{
  return !!value[isReactiveFlags.IS_READONLY];
}

function createActiveProxy(raw: any, baseHandler: any) {
  return new Proxy(raw, baseHandler);
}
