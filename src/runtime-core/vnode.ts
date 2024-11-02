import { ShapeFlags } from '../Shared/shapeFlag';

export function createVNode(type: any, props?: any, children?: any) {
  let vNode = {
    type,
    props,
    children,
    $el: null,
    shapeFlag: ShapeFlags.STATEFUL_COMPONENT
  };

  if (typeof type === 'string') {
    vNode.shapeFlag = ShapeFlags.ELEMENT;
  } else if (typeof type === 'object') {
    vNode.shapeFlag = ShapeFlags.STATEFUL_COMPONENT;
  }

  if (typeof children === 'string') {
    vNode.shapeFlag |= ShapeFlags.TEXT_CHILDREN;
  } else if (Array.isArray(children)) {
    vNode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN;
  }

  if (vNode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    if (typeof children === 'object') {
      vNode.shapeFlag |= ShapeFlags.SLOT_CHILDREN;
    }
  }

  return vNode;
}
