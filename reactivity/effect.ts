class ReactiveEffect {
  private _fn: Function;
  
  constructor(fn: Function) {
    this._fn = fn;
  }

  run(){
    activeEffect = this;
    return this._fn();
  }
}

let activeEffect: ReactiveEffect;
export function effect(fn: Function): Function {
  const reactiveEffect = new ReactiveEffect(fn);

  reactiveEffect.run();

  return reactiveEffect.run.bind(reactiveEffect);
}

let targetMap = new Map();
export function track(target: any, key: string | symbol){
  // target -> key -> fn
  let depsMap = targetMap.get(target);
  if(!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let dep = depsMap.get(key);
  if(!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }

  dep.add(activeEffect);
}

export function trigger(target: any, key: string | symbol){
  const dep = targetMap.get(target)?.get(key);
  if (dep) {
    for (const effect of dep) {
      effect.run();
    }
  }
}