import { track, trigger } from "./effect";


export function reactive(raw: any) {
  const _proxy = new Proxy(raw, {
    get(target, key) {
      const res = Reflect.get(target, key);

      // 1 收集依赖
      track(target, key);

      return res;
    },
    set(target, key, value) {
      const res = Reflect.set(target, key, value);

      // 2 触发依赖更新
      trigger(target, key);

      return res;
    }
  });
  return _proxy;
}