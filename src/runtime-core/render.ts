import { effect } from '../reactivity/index';
import { EMPTY_OBJ, hasOwn } from '../Shared/index';
import { ShapeFlags } from '../Shared/shapeFlag';
import { createComponentInstance, setupComponent } from './component';
import { createAppAPI } from './createApp';

export const Fragment = Symbol('Fragment');
export const Text = Symbol('Text');

export function createRender(options: any) {
  const { createElement, patchProp, insert, remove, setTextContext } = options;

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
      patchElement(n1, n2, container, parentComponent);
    }
  }

  function patchElement(n1: any, n2: any, container: any, parentComponent: any) {
    let oldProps = n1.props || EMPTY_OBJ;
    let nextProps = n2.props || EMPTY_OBJ;
    let el = (n2.el = n1.el);
    // 更新Children
    patchChildren(n1, n2, el, parentComponent);
    // 更新props
    patchProps(el, oldProps, nextProps);
  }

  function patchChildren(n1: any, n2: any, container: any, parentComponent: any) {
    // 新的是Array
    const prevShapeFlag = n1.shapeFlag;
    const nextShapeFlag = n2.shapeFlag;
    const c1 = n1.children;
    const c2 = n2.children;

    if (nextShapeFlag & ShapeFlags.TEXT_CHILDREN) {
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        unmountChildren(n1);
      }
      setTextContext(container, c2);
    }

    if (nextShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        setTextContext(container, null);
        mountChildren(c2, container, parentComponent);
      } else {
        // Array To Array
        patchKeyedChildren(c1, c2, container, parentComponent);
      }
    }
  }

  function patchKeyedChildren(c1: Array<any>, c2: Array<any>, container: any, parentComponent: any) {
    // body
    let i = 0;
    let e1 = c1.length - 1;
    let e2 = c2.length - 1;

    while (i <= e1 && i <= e2) {
      let n1 = c1[i];
      let n2 = c2[i];
      if (isSomeVNodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent);
      } else {
        break;
      }
      i++;
    }

    while (i <= e1 && i <= e2) {
      let n1 = c1[e1];
      let n2 = c2[e2];
      if (isSomeVNodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent);
      } else {
        break;
      }
      e1--;
      e2--;
    }
  }

  function isSomeVNodeType(n1: any, n2: any) {
    // body
    return n1.key === n2.key && n1.type === n2.type;
  }

  function unmountChildren(children: any) {
    for (let i = 0; i < children.length; i++) {
      const element = children[i].el;
      remove(element);
    }
  }

  function patchProps(el: any, oldProps: any, nextProps: any) {
    // 更新props
    if (oldProps !== nextProps) {
      for (const key in nextProps) {
        let prevVal = oldProps[key];
        let nextVal = nextProps[key];
        if (nextVal !== prevVal) {
          patchProp(el, key, prevVal, nextVal);
        }
      }
    }

    if (oldProps !== EMPTY_OBJ) {
      for (const key in oldProps) {
        if (!(key in nextProps)) {
          patchProp(el, key, oldProps[key], null);
        }
      }
    }
  }

  function mountChildren(children: any, container: any, parentComponent: any) {
    children.forEach((v: any) => {
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
      mountChildren(vNode.children, el, parentComponent);
    }

    for (const key in props) {
      if (hasOwn(props, key)) {
        patchProp(el, key, null, props[key]);
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
        if (!instance.isMounted) {
          const { proxy } = instance;
          const subTree = (instance.subTree = instance.render.call(proxy));
          patch(null, subTree, container, instance);
          vNode.el = subTree.el;
          instance.isMounted = true;
        } else {
          const { proxy } = instance;
          const subTree = instance.render.call(proxy);
          const prevSubTree = instance.subTree;
          instance.subTree = subTree;
          patch(prevSubTree, subTree, container, instance);
        }
      }
    });
  }

  return {
    createApp: createAppAPI(render)
  };
}
