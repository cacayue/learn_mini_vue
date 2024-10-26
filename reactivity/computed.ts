import { ReactiveEffect } from './effect';

class ComputedImpl {
  private _current: any = undefined;
  private _dirty = true;
  private _effect: ReactiveEffect;
  constructor(getter: any) {
    // 将getter也变为响应式
    // 那么当getter内部获取值发生变化时会触发getter变化, 也就触发_effect变化, 然后可以调用scheduler
    // a = reactive()
    // getter = fn(() => { return a }) => a = newValue => getter.scheduler => _dirty变化
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
