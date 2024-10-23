import { triggerEffects } from '../../vue_sourcecode/mini-vue/packages/reactivity/src/effect';
type EffectOption = {
  scheduler?: () => void;
  onstop?: () => void;
};

let activeEffect: ReactiveEffect;
let shouldTrack: boolean = true;

class ReactiveEffect {
  private _fn: Function;
  public Option: EffectOption | undefined;
  public deps: Array<Set<ReactiveEffect>>;
  public active: boolean = true;

  constructor(fn: Function, option?: EffectOption | undefined) {
    this._fn = fn;
    this.Option = option;
    this.deps = [];
  }

  run() {
    if (!this.active) {
      return this._fn();
    }

    shouldTrack = true;
    activeEffect = this;
    const res = this._fn();
    shouldTrack = false;
    return res;
  }

  stop() {
    if (this.active) {
      if (this.Option && this.Option?.onstop) {
        this.Option.onstop();
      }
      this.deps?.forEach((dep) => {
        dep.delete(this);
      });
      this.active = false;
    }
  }
}

export function effect(fn: Function, option?: EffectOption | undefined): Function {
  const reactiveEffect = new ReactiveEffect(fn, option);

  reactiveEffect.run();

  const runner: any = reactiveEffect.run.bind(reactiveEffect);

  runner.effect = reactiveEffect;

  return runner;
}

let targetMap = new WeakMap<any, Map<string | symbol, Set<ReactiveEffect>>>();
export function track(target: any, key: string | symbol) {
  // target -> key -> fn
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set<ReactiveEffect>();
    depsMap.set(key, dep);
  }

  trackEffects(dep);
}

export function trackEffects(dep: Set<any>) {
  if (activeEffect && shouldTrack) {
    dep.add(activeEffect);
    activeEffect.deps?.push(dep);
  }
}

export function trigger(target: any, key: string | symbol) {
  const dep = targetMap.get(target)?.get(key);
  if (dep) {
    triggerEffects(dep);
  }
}

export function triggerEffects(dep: Set<any>) {
  for (const effect of dep) {
    if (effect.Option && effect.Option?.scheduler) {
      effect.Option.scheduler();
    } else {
      effect.run();
    }
  }
}

export function stop(runner: any) {
  runner?.effect.stop();
}
