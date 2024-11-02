import { render } from './render';
import { createVNode } from './vnode';

export const createApp = (rootComponent: any) => {
  return {
    mount(rootContainer: any) {
      // build vNode
      let vNode = createVNode(rootComponent);

      render(vNode, rootContainer);
    }
  };
};
