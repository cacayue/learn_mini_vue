import { createVNode } from '../vnode';

export function renderSlot(slots: any, name: string) {
  const slot = slots[name];

  if (slot) {
    return createVNode('div', {}, slot);
  }
}
