import { getCurrentInstance } from './component';

export function provide(key: string, value: any) {
  const instance = getCurrentInstance();
  if (instance) {
    let { provides } = instance;
    const parentProvide = instance.parent && instance.parent.provides;
    if (provides === parentProvide) {
      provides = instance.provides = Object.create(parentProvide);
    }
    provides[key] = value;
  }
}

export function inject(key: string, defaultValue: any) {
  const instance = getCurrentInstance();
  if (instance) {
    const val = instance.parent?.provides[key];
    if (val) {
      return val;
    } else {
      if (typeof defaultValue === 'function') {
        return defaultValue();
      } else {
        return defaultValue;
      }
    }
  }
}
