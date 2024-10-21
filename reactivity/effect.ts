type EffectOption = {
  scheduler: () => void;
}


class ReactiveEffect {
  private _fn: Function;
  public Option: EffectOption | undefined;
  
  constructor(fn: Function, option?: EffectOption | undefined) {
    this._fn = fn;
    this.Option = option;
  }

  run(){
    activeEffect = this;
    return this._fn();
  }
}

let activeEffect: ReactiveEffect;
export function effect(fn: Function, option?: EffectOption | undefined): Function {
  const reactiveEffect = new ReactiveEffect(fn, option);

  reactiveEffect.run();

  return reactiveEffect.run.bind(reactiveEffect);
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

  dep.add(activeEffect);
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