import { mutableHandler, readonlyHandler } from "./baseHandler";

export function reactive(raw: any) {
  return createActiveProxy(raw, mutableHandler);
}

export function readonly(raw: any) {
  return createActiveProxy(raw, readonlyHandler);
}

function createActiveProxy(raw: any, baseHandler: any) {
  return new Proxy(raw, baseHandler);
}