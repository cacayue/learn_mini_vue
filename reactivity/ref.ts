import { hasChanged, isObject } from '../Shared';
import { trackEffects, triggerEffects } from './effect';

class RefImpl {
  private _value: any;
  public dep: Set<any>;
  constructor(value: any) {
    this.dep = new Set<any>();
    this._value = value;
  }

  public get value(): any {
    trackEffects(this.dep);
    return this._value;
  }

  public set value(newValue: any) {
    if (hasChanged(this._value, newValue)) {
      this._value = newValue;
      triggerEffects(this.dep);
    }
  }
}

export function ref(raw: any) {
  return new RefImpl(raw);
}
