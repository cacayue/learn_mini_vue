import { createComponentInstance, setupComponent } from './component';

export function render(vnode: any, container: any) {
  // call patch: 递归处理组件或者节点
  patch(vnode, container);
}

function patch(vnode: any, container: any) {
  const type = vnode.type;
  if (typeof type === 'string') {
    processElementComponent(vnode, container);
  } else if (typeof type === 'object') {
    processComponent(vnode, container);
  }
}

function processElementComponent(vnode: any, container: any) {
  mountElement(vnode, container);
}

function mountElement(vnode: any, container: any) {
  // 添加真实的el元素
  const { type, props, children } = vnode;
  const el: Element = document.createElement(type);

  if (typeof children === 'string') {
    el.textContent = children;
  } else if (Array.isArray(children)) {
    children.forEach((v) => {
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

function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container);
}

function mountComponent(vnode: any, container: any) {
  var instance = createComponentInstance(vnode);
  setupComponent(instance);
  setupRenderEffect(instance, container);
}

function setupRenderEffect(instance: any, container: any) {
  if (instance.render) {
    const { proxy } = instance;
    const subTree = instance.render.call(proxy);
    // vnode => element => mountElement
    patch(subTree, container);
  }
}
