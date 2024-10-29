import { hasOwn } from '../Shared/index';

const publicPropertiesMap = {
  $el: (i: any) => {
    return i.vnode.el;
  }
};

export const PublicInstanceProxyHandlers = {
  get({ _: instance }: any, key: any) {
    const { setupState, props } = instance;

    if (hasOwn(setupState, key)) {
      return setupState[key];
    } else if (hasOwn(props, key)) {
      return props[key];
    }

    if (key in publicPropertiesMap) {
      const publicGetter = publicPropertiesMap[key as keyof typeof publicPropertiesMap];
      if (publicGetter) {
        return publicGetter(instance);
      }
    }
  }
};
