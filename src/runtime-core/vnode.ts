export function createVNode(type: any, props?: any, children?: any) {
  let vnode = {
    type,
    props,
    children,
    $el: null
  };
  return vnode;
}
