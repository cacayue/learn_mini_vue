import { hasOwn } from '../Shared/index';
import { ShapeFlags } from '../Shared/shapeFlag';
import { createComponentInstance, setupComponent } from './component';
import { createAppAPI } from './createApp';

export const Fragment = Symbol('Fragment');
export const Text = Symbol('Text');

export function createRender(options: any) {
  const { createElement, patchProp, insert } = options;

  function render(vNode: any, container: any) {
    // call patch: 递归处理组件或者节点
    patch(vNode, container, undefined);
  }

  function patch(vNode: any, container: any, parentComponent: any) {
    const { type, shapeFlag } = vNode;

    if (type === Fragment) {
      processFragment(vNode, container, parentComponent);
    } else if (type === Text) {
      processText(vNode, container);
    } else if (shapeFlag & ShapeFlags.ELEMENT) {
      processElementComponent(vNode, container, parentComponent);
    } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
      processComponent(vNode, container, parentComponent);
    }
  }

  function processText(vNode: any, container: any) {
    const { children } = vNode;
    const textNode: any = (vNode.el = document.createTextNode(children));
    container.append(textNode);
  }

  function processFragment(vNode: any, container: any, parentComponent: any) {
    mountChildren(vNode, container, parentComponent);
  }

  function processElementComponent(vNode: any, container: any, parentComponent: any) {
    mountElement(vNode, container, parentComponent);
  }

  function mountChildren(vNode: any, container: any, parentComponent: any) {
    vNode.children.forEach((v: any) => {
      patch(v, container, parentComponent);
    });
  }

  function mountElement(vNode: any, container: any, parentComponent: any) {
    // 添加真实的el元素
    const { type, props, children, shapeFlag } = vNode;
    const el: Element = (vNode.el = createElement(type));

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children;
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vNode, el, parentComponent);
    }

    for (const key in props) {
      if (hasOwn(props, key)) {
        patchProp(el, key, props[key]);
      }
    }

    insert(el, container);
  }

  function processComponent(vNode: any, container: any, parentComponent: any) {
    mountComponent(vNode, container, parentComponent);
  }

  function mountComponent(vNode: any, container: any, parentComponent: any) {
    var instance = createComponentInstance(vNode, parentComponent);
    setupComponent(instance);
    setupRenderEffect(instance, vNode, container);
  }

  function setupRenderEffect(instance: any, vNode: any, container: any) {
    if (instance.render) {
      const { proxy } = instance;
      const subTree = instance.render.call(proxy);
      // vNode => element => mountElement
      patch(subTree, container, instance);
      vNode.el = subTree.el;
    }
  }

  return {
    createApp: createAppAPI(render)
  };
}
