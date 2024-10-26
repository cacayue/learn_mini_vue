import { createComponentInstance, setupComponent } from './component';

export function render(vnode: any, container: any) {
  // call patch: 递归处理组件或者节点
  patch(vnode, container);
}

function patch(vnode: any, container: any) {
  processComponent(vnode, container);
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
  const subTree = instance.render;
  // vnode => element => mountElement
  patch(subTree, container);
}
