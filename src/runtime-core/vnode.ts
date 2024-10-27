import { ShapeFlags } from '../Shared/shapeFlag';

export function createVNode(type: any, props?: any, children?: any) {
  let vnode = {
    type,
    props,
    children,
    $el: null,
    shapeFlag: ShapeFlags.STATEFUL_COMPONENT
  };

  if (typeof type === 'string') {
    vnode.shapeFlag = ShapeFlags.ELEMENT;
  } else if (typeof type === 'object') {
    vnode.shapeFlag = ShapeFlags.STATEFUL_COMPONENT;
  }

  if (typeof children === 'string') {
    vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN;
  } else if (Array.isArray(children)) {
    vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN;
  }

  return vnode;
}
