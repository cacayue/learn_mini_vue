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
    patch(null, vNode, container, undefined, null);
  }

  function patch(n1: any, n2: any, container: any, parentComponent: any, anchor: any) {
    const { type, shapeFlag } = n2;

    if (type === Fragment) {
      processFragment(n2, container, parentComponent, anchor);
    } else if (type === Text) {
      processText(n2, container);
    } else if (shapeFlag & ShapeFlags.ELEMENT) {
      processElementComponent(n1, n2, container, parentComponent, anchor);
    } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
      processComponent(n2, container, parentComponent, anchor);
    }
  }

  function processText(vNode: any, container: any) {
    const { children } = vNode;
    const textNode: any = (vNode.el = document.createTextNode(children));
    container.append(textNode);
  }

  function processFragment(vNode: any, container: any, parentComponent: any, anchor: any) {
    mountChildren(vNode, container, parentComponent, anchor);
  }

  function processElementComponent(n1: any, n2: any, container: any, parentComponent: any, anchor: any) {
    if (!n1) {
      mountElement(n2, container, parentComponent, anchor);
    } else {
      patchElement(n1, n2, container, parentComponent, anchor);
    }
  }

  function patchElement(n1: any, n2: any, container: any, parentComponent: any, anchor: any) {
    let oldProps = n1.props || EMPTY_OBJ;
    let nextProps = n2.props || EMPTY_OBJ;
    let el = (n2.el = n1.el);
    // 更新Children
    patchChildren(n1, n2, el, parentComponent, anchor);
    // 更新props
    patchProps(el, oldProps, nextProps);
  }

  function patchChildren(n1: any, n2: any, container: any, parentComponent: any, anchor: any) {
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
        mountChildren(c2, container, parentComponent, anchor);
      } else {
        // Array To Array
        patchKeyedChildren(c1, c2, container, parentComponent, anchor);
      }
    }
  }

  function patchKeyedChildren(c1: Array<any>, c2: Array<any>, container: any, parentComponent: any, parentAnchor: any) {
    // body
    let i = 0;
    const l2 = c2.length;
    let e1 = c1.length - 1;
    let e2 = l2 - 1;

    while (i <= e1 && i <= e2) {
      let n1 = c1[i];
      let n2 = c2[i];
      if (isSomeVNodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent, parentAnchor);
      } else {
        break;
      }
      i++;
    }

    while (i <= e1 && i <= e2) {
      let n1 = c1[e1];
      let n2 = c2[e2];
      if (isSomeVNodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent, parentAnchor);
      } else {
        break;
      }
      e1--;
      e2--;
    }

    if (i > e1) {
      if (i <= e2) {
        let n2 = c2[i];
        if (n2) {
          const position = e2 + 1;
          const anchor = position <= l2 ? c2[position].el : null;
          while (i <= e2) {
            patch(null, n2, container, parentComponent, anchor);
            i++;
          }
        }
      }
    } else if (i > e2) {
      while (i <= e1) {
        remove(c1[e1]?.el);
        i++;
      }
    } else {
      // 中间对比
      let s1 = i;
      let s2 = i;
      let keyToNewMap = new Map();
      // 旧节点已经遍历的数量
      let patched = 0;
      // 新数组需要遍历的节点数量
      let toBePatched = e2 - s2 + 1;
      let newIndexToOldIndexMap = new Array(toBePatched);

      for (let i = 0; i < toBePatched; i++) {
        newIndexToOldIndexMap[i] = 0;
      }

      // 循环新节点, 构建新节点映射 O(i)
      for (let i = s2; i <= e2; i++) {
        const nextChildren = c2[i];
        keyToNewMap.set(nextChildren.key, i);
      }

      // 循环老节点
      for (let i = s1; i <= e1; i++) {
        const prevChildren = c1[i];
        if (patched >= toBePatched) {
          remove(prevChildren.el);
          continue;
        }
        // 根据map 获取是否存在相同的新节点
        let nextIndex = keyToNewMap.get(prevChildren?.key);
        if (nextIndex === undefined) {
          // map中没有, 则根据循环 获取是否存在相同的新节点
          for (let j = 0; j < e2; j++) {
            const nextChildrenJ = c2[j];
            if (isSomeVNodeType(prevChildren, nextChildrenJ)) {
              nextIndex = j;
              break;
            }
          }
        }
        if (nextIndex === undefined) {
          remove(prevChildren.el);
        } else {
          // 当老节点存在于新节点中, 构建新节点位置对应的老节点位置
          // 1. 新节点需要从0开始计算
          // 2. 由于0为需要插入的节点, 所以老节点索引默认加1
          newIndexToOldIndexMap[nextIndex - s2] = i + 1;

          patch(prevChildren, c2[nextIndex], container, parentComponent, null);
          patched++;
        }
      }

      // 获取最长递增子序列, 用于确定不稳定的值是哪些
      const sequences = getSequence(newIndexToOldIndexMap);
      // 稳定子序列的起始值
      let j = 0;
      for (let i = 0; i < newIndexToOldIndexMap.length; i++) {
        // 获取最长递增序列的值
        let seqIndex = sequences[j];
        // 存储旧节点索引时加上了数组长度, 所以该处需要减去
        let newChildIndex = newIndexToOldIndexMap[i] - s2;
        // 如果取得的值不在递增序列中则需要移动
        if (newChildIndex !== seqIndex) {
          console.log('需要移动');
        } else {
          j++;
        }
      }
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

  function mountChildren(children: any, container: any, parentComponent: any, anchor: any) {
    children.forEach((v: any) => {
      patch(null, v, container, parentComponent, anchor);
    });
  }

  function mountElement(vNode: any, container: any, parentComponent: any, anchor: any) {
    // 添加真实的el元素
    const { type, props, children, shapeFlag } = vNode;
    const el: Element = (vNode.el = createElement(type));

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children;
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vNode.children, el, parentComponent, anchor);
    }

    for (const key in props) {
      if (hasOwn(props, key)) {
        patchProp(el, key, null, props[key]);
      }
    }

    insert(el, container, anchor);
  }

  function processComponent(vNode: any, container: any, parentComponent: any, anchor: any) {
    mountComponent(vNode, container, parentComponent, anchor);
  }

  function mountComponent(vNode: any, container: any, parentComponent: any, anchor: any) {
    var instance = createComponentInstance(vNode, parentComponent);
    setupComponent(instance);
    setupRenderEffect(instance, vNode, container, anchor);
  }

  function setupRenderEffect(instance: any, vNode: any, container: any, anchor: any) {
    effect(() => {
      if (instance.render) {
        if (!instance.isMounted) {
          const { proxy } = instance;
          const subTree = (instance.subTree = instance.render.call(proxy));
          patch(null, subTree, container, instance, anchor);
          vNode.el = subTree.el;
          instance.isMounted = true;
        } else {
          const { proxy } = instance;
          const subTree = instance.render.call(proxy);
          const prevSubTree = instance.subTree;
          instance.subTree = subTree;
          patch(prevSubTree, subTree, container, instance, anchor);
        }
      }
    });
  }

  return {
    createApp: createAppAPI(render)
  };
}

/** 最长递增子序列, 为了Diff中获取最长的不需要移动的子序列 */
function getSequence(arr: number[]): number[] {
  const p = arr.slice();
  const result = [0];
  let i, j, u, v, c;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p[i] = j;
        result.push(i);
        continue;
      }
      u = 0;
      v = result.length - 1;
      while (u < v) {
        c = (u + v) >> 1;
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v = c;
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p[i] = result[u - 1];
        }
        result[u] = i;
      }
    }
  }
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p[v];
  }
  return result;
}
