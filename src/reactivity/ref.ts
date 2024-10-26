import { hasChanged, isObject } from '../Shared/index';
import { trackEffects, triggerEffects } from './effect';
import { reactive } from './reactive';

class RefImpl {
  private _value: any;
  private _rawValue: any;
  public dep: Set<any>;
  public _v_isRef = true;
  constructor(value: any) {
    this.dep = new Set<any>();
    this._value = convertObj(value);
    this._rawValue = value;
  }

  public get value(): any {
    trackEffects(this.dep);
    return this._value;
  }

  public set value(newValue: any) {
    if (hasChanged(this._rawValue, newValue)) {
      this._value = convertObj(newValue);
      this._rawValue = newValue;
      triggerEffects(this.dep);
    }
  }
}

function convertObj(value: any) {
  return isObject(value) ? reactive(value) : value;
}

export function ref(raw: any) {
  return new RefImpl(raw);
}

export function proxyRefs(raw: any) {
  return new Proxy(raw, {
    get(target, key) {
      const res = Reflect.get(target, key);
      return unRef(res);
    },
    set(target, key, newValue) {
      const res = Reflect.get(target, key);
      if (!isRef(res) && !isRef(newValue)) {
        Reflect.set(target, key, newValue);
      } else if (isRef(res) && !isRef(newValue)) {
        res.value = newValue;
      } else if (isRef(res) && isRef(newValue)) {
        res.value = newValue.value;
      }

      return res;
    }
  });
}

export function isRef(raw: any) {
  return !!raw._v_isRef;
}

export function unRef(raw: any) {
  if (isRef(raw)) {
    return raw.value;
  }
  return raw;
}
