import { effect } from '../reactivity/index';
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
    patch(null, vNode, container, undefined);
  }

  function patch(n1: any, n2: any, container: any, parentComponent: any) {
    const { type, shapeFlag } = n2;

    if (type === Fragment) {
      processFragment(n2, container, parentComponent);
    } else if (type === Text) {
      processText(n2, container);
    } else if (shapeFlag & ShapeFlags.ELEMENT) {
      processElementComponent(n1, n2, container, parentComponent);
    } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
      processComponent(n2, container, parentComponent);
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

  function processElementComponent(n1: any, n2: any, container: any, parentComponent: any) {
    if (!n1) {
      mountElement(n2, container, parentComponent);
    } else {
      console.log('update ele');
      console.log('prev', n1);
      console.log('current', n2);
    }
  }

  function mountChildren(vNode: any, container: any, parentComponent: any) {
    vNode.children.forEach((v: any) => {
      patch(null, v, container, parentComponent);
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
    effect(() => {
      if (instance.render) {
        const { proxy } = instance;
        const subTree = instance.render.call(proxy);
        if (!instance.isMounted) {
          // vNode => element => mountElement
          patch(null, subTree, container, instance);
          instance.isMounted = true;
        } else {
          const prevSubTree = instance.subTree;
          const subTree = instance.render.call(proxy);
          patch(prevSubTree, subTree, container, instance);
        }
        vNode.el = subTree.el;
        instance.subTree = subTree;
      }
    });
  }

  return {
    createApp: createAppAPI(render)
  };
}
