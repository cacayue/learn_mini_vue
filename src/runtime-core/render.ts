import { ShapeFlags } from '../Shared/shapeFlag';
import { createComponentInstance, setupComponent } from './component';

export function render(vNode: any, container: any) {
  // call patch: 递归处理组件或者节点
  patch(vNode, container);
}

function patch(vNode: any, container: any) {
  const { shapeFlag } = vNode;
  if (shapeFlag & ShapeFlags.ELEMENT) {
    processElementComponent(vNode, container);
  } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    processComponent(vNode, container);
  }
}

function processElementComponent(vNode: any, container: any) {
  mountElement(vNode, container);
}

function mountElement(vNode: any, container: any) {
  // 添加真实的el元素
  const { type, props, children, shapeFlag } = vNode;
  const el: Element = (vNode.el = document.createElement(type));

  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children;
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    children.forEach((v: any) => {
      patch(v, el);
    });
  }

  for (const key in props) {
    if (Object.prototype.hasOwnProperty.call(props, key)) {
      const element = props[key];
      el.setAttribute(key, element);
    }
  }

  container.append(el);
}

function processComponent(vNode: any, container: any) {
  mountComponent(vNode, container);
}

function mountComponent(vNode: any, container: any) {
  var instance = createComponentInstance(vNode);
  setupComponent(instance);
  setupRenderEffect(instance, vNode, container);
}

function setupRenderEffect(instance: any, vNode: any, container: any) {
  if (instance.render) {
    const { proxy } = instance;
    const subTree = instance.render.call(proxy);
    // vNode => element => mountElement
    patch(subTree, container);
    vNode.el = subTree.el;
  }
}
