import { track, trigger } from '../reactivity/effect';
import { isObject } from '../Shared';
import { isReactiveFlags, reactive, readonly } from './reactive';

const get = CreateGetter();
const set = CreateSetter();
const readonlyGet = CreateGetter(true);

function CreateGetter(isReadonly: boolean = false) {
  return function get(target: any, key: any) {
    if (key === isReactiveFlags.IS_REACTIVE) {
      return !isReadonly;
    } else if (key === isReactiveFlags.IS_READONLY) {
      return isReadonly;
    }

    const res = Reflect.get(target, key);

    if (!isReadonly && isObject(res)) {
      return reactive(res);
    }

    if (isReadonly && isObject(res)) {
      return readonly(res);
    }

    if (!isReadonly) {
      // 1 收集依赖
      track(target, key);
    }
    return res;
  };
}

function CreateSetter(isReadonly: boolean = false) {
  return function set(target: any, key: string | symbol, value: any) {
    const res = Reflect.set(target, key, value);

    // 2 触发依赖更新
    trigger(target, key);

    return res;
  };
}

const mutableHandler = {
  get,
  set
};

const readonlyHandler = {
  get: readonlyGet,
  set(target: any, key: any) {
    console.warn(`${target} is readOnly,${key} can not be set.`);
    return true;
  }
};

export { mutableHandler, readonlyHandler };
