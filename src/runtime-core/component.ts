export function createComponentInstance(vnode: any) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    render: undefined,
    proxy: undefined
  };

  return component;
}

export function setupComponent(instance: any) {
  initProps(instance.vnode.props);
  initSlots(instance.vnode.slots);
  setupStatefulComponent(instance);
}

function initProps(props: any) {
  // TODO
}
function initSlots(slots: any) {
  // TODO
}

function setupStatefulComponent(instance: any) {
  const Component = instance.type;
  const { setup } = Component;
  if (setup) {
    const setupResult = setup();
    handleSetupResult(instance, setupResult);
  }
  instance.proxy = new Proxy(
    {},
    {
      get(target, key) {
        const { setupState } = instance;

        if (key === '$el') {
          return instance.vnode.el;
        }

        return setupState[key];
      }
    }
  );
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
