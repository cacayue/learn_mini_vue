import { render } from './render';
import { createVNode } from './vnode';

export const createApp = (rootComponent: any) => {
  return {
    mount(rootContainer: any) {
      // build vnode
      let vnode = createVNode(rootComponent);

      render(vnode, rootContainer);
    }
  };
};
