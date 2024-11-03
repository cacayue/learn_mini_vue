import { createVNode } from './vnode';

export function createAppAPI(render: any) {
  return function createApp(rootComponent: any) {
    return {
      mount(rootContainer: any) {
        // build vNode
        let vNode = createVNode(rootComponent);

        render(vNode, rootContainer);
      }
    };
  };
}
