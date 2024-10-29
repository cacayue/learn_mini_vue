import { shadowReadonly } from '../reactivity/reactive';
import { PublicInstanceProxyHandlers } from './comonentPublicProxyInstance';
import { initProps } from './componentProps';

export function createComponentInstance(vnode: any) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    render: undefined,
    proxy: undefined,
    props: {}
  };

  return component;
}

export function setupComponent(instance: any) {
  initProps(instance, instance.vnode.props);
  initSlots(instance.vnode.slots);
  setupStatefulComponent(instance);
}

function initSlots(slots: any) {
  // TODO
}

function setupStatefulComponent(instance: any) {
  const Component = instance.type;
  const { props } = instance;
  const { setup } = Component;
  if (setup) {
    const setupResult = setup(shadowReadonly(props));
    handleSetupResult(instance, setupResult);
  }
  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
}

function handleSetupResult(instance: any, setupResult: any) {
  // TODO function
  // object
  if (setupResult && typeof setupResult === 'object') {
    instance.setupState = setupResult;
  }

  finishComponentSetup(instance);
}

function finishComponentSetup(instance: any) {
  const Component = instance.type;
  if (Component.render) {
    instance.render = Component.render;
  }
}
