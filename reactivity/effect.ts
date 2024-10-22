type EffectOption = {
  scheduler: () => void;
}

class ReactiveEffect {
  private _fn: Function;
  public Option: EffectOption | undefined;
  public deps: Array<Set<ReactiveEffect>>;
  
  constructor(fn: Function, 
    option?: EffectOption | undefined
  ) {
    this._fn = fn;
    this.Option = option;
    this.deps = [];
  }

  run() {
    activeEffect = this;
    return this._fn();
  }

  stop() {
    this.deps?.forEach(dep => {
      dep.delete(this);
    });
  }
}

let activeEffect: ReactiveEffect;
export function effect(fn: Function, option?: EffectOption | undefined): Function {
  const reactiveEffect = new ReactiveEffect(fn, option);

  reactiveEffect.run();

  const runner: any = reactiveEffect.run.bind(reactiveEffect);

  runner.effect = reactiveEffect;

  return runner;
}

let targetMap = new Map<any, Map<string | symbol, Set<ReactiveEffect>>>();
export function track(target: any, key: string | symbol){
  // target -> key -> fn
  let depsMap = targetMap.get(target);
  if(!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let dep = depsMap.get(key);
  if(!dep) {
    dep = new Set<ReactiveEffect>();
    depsMap.set(key, dep);
  }

  if (activeEffect) {
    dep.add(activeEffect);
    activeEffect.deps?.push(dep);
  }
}

export function trigger(target: any, key: string | symbol){
  const dep = targetMap.get(target)?.get(key);
  if (dep) {
    for (const effect of dep) {
      if (effect.Option) {
        effect.Option?.scheduler();
      }else{
        effect.run();
      }
    }
  }
}

export function stop(runner: any){
  runner?.effect.stop();
}