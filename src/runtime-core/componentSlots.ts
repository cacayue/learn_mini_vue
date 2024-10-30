import { createVNode } from './vnode';

export function initSlots(instance: any, children: any) {
  instance.slots = children;
}
