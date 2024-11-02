export function initSlots(instance: any, children: any) {
  for (const key in children) {
    const slot = children[key];
    if (slot) {
      instance.slots[key] = Array.isArray(slot) ? slot : [slot];
    }
  }
}
