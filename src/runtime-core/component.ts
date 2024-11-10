import { proxyRefs } from '../reactivity/index';
import { shadowReadonly } from '../reactivity/reactive';
import { PublicInstanceProxyHandlers } from './comonentPublicProxyInstance';
import { emit } from './componentEmits';
import { initProps } from './componentProps';
import { initSlots } from './componentSlots';

export function createComponentInstance(vNode: any, parent: any) {
  let component: any = {
    vNode,
    next: null,
    type: vNode.type,
    setupState: {},
    render: undefined,
    proxy: undefined,
    props: {},
    emit: () => {},
    slots: {},
    provides: parent?.provides ?? {},
    parent: parent,
    isMounted: false,
    subTree: {},
    update: () => {}
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
    const setupContext = createSetupContext(instance);
    const setupResult = setup(shadowReadonly(props), setupContext);
    setCurrentInstance(null);
    handleSetupResult(instance, setupResult);
  }
  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
}

function handleSetupResult(instance: any, setupResult: any) {
  // TODO function
  // object
  if (setupResult && typeof setupResult === 'object') {
    instance.setupState = proxyRefs(setupResult);
  }

  finishComponentSetup(instance);
}

function finishComponentSetup(instance: any) {
  const Component = instance.type;
  if (Component.render) {
    instance.render = Component.render;
  }
}

let currentInstance: any = {};
export function getCurrentInstance() {
  return currentInstance;
}

function setCurrentInstance(instance: any) {
  currentInstance = instance;
}

function createSetupContext(instance: any) {
  console.log('初始化 setup context');
  return {
    attrs: instance.attrs,
    slots: instance.slots,
    emit: instance.emit,
    expose: () => {} // TODO 实现 expose 函数逻辑
  };
}
