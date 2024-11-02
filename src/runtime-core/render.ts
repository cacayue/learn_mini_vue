import { hasOwn } from '../Shared/index';
import { ShapeFlags } from '../Shared/shapeFlag';
import { createComponentInstance, setupComponent } from './component';

export const Fragment = Symbol('Fragment');
export const Text = Symbol('Text');

export function render(vNode: any, container: any) {
  // call patch: 递归处理组件或者节点
  patch(vNode, container);
}

function patch(vNode: any, container: any) {
  const { type, shapeFlag } = vNode;

  if (type === Fragment) {
    processFragment(vNode, container);
  } else if (type === Text) {
    processText(vNode, container);
  } else if (shapeFlag & ShapeFlags.ELEMENT) {
    processElementComponent(vNode, container);
  } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    processComponent(vNode, container);
  }
}

function processText(vNode: any, container: any) {
  const { children } = vNode;
  const textNode: any = (vNode.el = document.createTextNode(children));
  container.append(textNode);
}

function processFragment(vNode: any, container: any) {
  mountChildren(vNode, container);
}

function processElementComponent(vNode: any, container: any) {
  mountElement(vNode, container);
}

function mountChildren(vNode: any, container: any) {
  vNode.children.forEach((v: any) => {
    patch(v, container);
  });
}

function mountElement(vNode: any, container: any) {
  // 添加真实的el元素
  const { type, props, children, shapeFlag } = vNode;
  const el: Element = (vNode.el = document.createElement(type));

  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children;
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(vNode, el);
  }

  for (const key in props) {
    if (hasOwn(props, key)) {
      const element = props[key];
      const isOn = (key: string) => /^on[A-Z]/.test(key);
      if (isOn(key)) {
        const event = key.slice(2).toLowerCase();
        el.addEventListener(event, element);
      } else {
        el.setAttribute(key, element);
      }
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
