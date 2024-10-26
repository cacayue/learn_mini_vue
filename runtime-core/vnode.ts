export function createVNode(type: any, props?: any, children?: any) {
  let vnode = {
    type,
    props,
    children
  };
  return vnode;
}
