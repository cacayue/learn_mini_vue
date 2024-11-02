import { isObject, hasOwn } from '../../Shared/index';
import { createVNode } from '../vnode';

export function renderSlot(key: string, children: any) {
  if (Array.isArray(children)) {
    return createVNode('div', {}, children);
  } else if (isObject(children) && hasOwn(children, key)) {
    return children[key];
  }

  return children;
}
