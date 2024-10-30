import { shadowReadonly } from '../reactivity/reactive';
import { PublicInstanceProxyHandlers } from './comonentPublicProxyInstance';
import { emit } from './componentEmits';
import { initProps } from './componentProps';
import { initSlots } from './componentSlots';

export function createComponentInstance(vnode: any) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    render: undefined,
    proxy: undefined,
    props: {},
    emit: () => {},
    slots: {}
  };

  component.emit = emit.bind(null, component) as any;

  return component;
}

export function setupComponent(instance: any) {
  initProps(instance, instance.vnode.props);
  initSlots(instance, instance.vnode.children);
  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance: any) {
  const Component = instance.type;
  const { props, emit } = instance;
  const { setup } = Component;
  if (setup) {
    const setupResult = setup(shadowReadonly(props), {
      emit
    });
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
