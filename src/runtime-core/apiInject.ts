import { getCurrentInstance } from './component';

export function provide(key: string, value: any) {
  const instance = getCurrentInstance();
  if (instance) {
    instance.provides[key] = value;
  }
}

export function inject(key: string) {
  const instance = getCurrentInstance();
  if (instance) {
    const val = instance.parent?.provides[key];
    if (val) {
      return val;
    }
  }
}
