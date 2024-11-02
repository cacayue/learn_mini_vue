import { ShapeFlags } from '../Shared/shapeFlag';

export function initSlots(instance: any, children: any) {
  const { vNode } = instance;
  if (vNode.shapeFlag & ShapeFlags.SLOT_CHILDREN) {
    normalizeObjectSlots(children, instance.slots);
  }
}

function normalizeObjectSlots(children: any, slots: any) {
  for (const key in children) {
    const slot = children[key];
    if (typeof slot === 'function') {
      if (slot) {
        slots[key] = (props: any) => normalizeArraySlot(slot(props));
      } else {
        slots[key] = normalizeArraySlot(slot);
      }
    }
  }
}

function normalizeArraySlot(slot: any): any {
  return Array.isArray(slot) ? slot : [slot];
}
