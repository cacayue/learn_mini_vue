import { shadowReadonly } from '../reactivity/reactive';
import { PublicInstanceProxyHandlers } from './comonentPublicProxyInstance';
import { emit } from './componentEmits';
import { initProps } from './componentProps';
import { initSlots } from './componentSlots';

export function createComponentInstance(vNode: any, parent: any) {
  const component = {
    vNode,
    type: vNode.type,
    setupState: {},
    render: undefined,
    proxy: undefined,
    props: {},
    emit: () => {},
    slots: {},
    provides: Object.assign({}, parent?.provides ?? {}),
    parent: parent
  };

  component.emit = emit.bind(null, component) as any;

  return component;
}

export function setupComponent(instance: any) {
  initProps(instance, instance.vNode.props);
  initSlots(instance, instance.vNode.children);
  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance: any) {
  const Component = instance.type;
  const { props, emit } = instance;
  const { setup } = Component;
  if (setup) {
    setCurrentInstance(instance);
    const setupResult = setup(shadowReadonly(props), {
      emit
    });
    setCurrentInstance(null);
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

let currentINstance: any;
export function getCurrentInstance() {
  return currentINstance;
}

function setCurrentInstance(instance: any) {
  currentINstance = instance;
}
