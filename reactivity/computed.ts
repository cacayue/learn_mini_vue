import { ReactiveEffect } from './effect';

class ComputedImpl {
  private _getter: Function;
  private _current: any = undefined;
  private _dirty = true;
  private _effect: ReactiveEffect;
  constructor(getter: any) {
    this._getter = getter;

    this._effect = new ReactiveEffect(getter, {
      scheduler: () => {
        if (!this._dirty) {
          this._dirty = true;
        }
      }
    });
  }

  public get value(): any {
    if (this._dirty) {
      this._dirty = false;
      this._current = this._effect.run();
    }
    return this._current;
  }
}

export function computed(getter: Function) {
  return new ComputedImpl(getter);
}
