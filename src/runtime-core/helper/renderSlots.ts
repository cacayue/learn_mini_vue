import { createVNode } from '../vnode';

export function renderSlot(children: any) {
  if (Array.isArray(children)) {
    return createVNode('div', {}, children);
  } else {
    return children;
  }
}
