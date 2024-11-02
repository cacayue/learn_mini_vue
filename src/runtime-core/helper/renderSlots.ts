import { createVNode } from '../vnode';

export function renderSlot(slots: any, name: string, props: any) {
  const slotArr = slots[name];

  if (slotArr) {
    const renderSlots = slotArr.flatMap((s: any) => {
      if (typeof s === 'function') {
        return s(props);
      } else {
        return s;
      }
    });

    return createVNode('div', {}, renderSlots);
  }
}
