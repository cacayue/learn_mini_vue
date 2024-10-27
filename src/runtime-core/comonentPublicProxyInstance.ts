const publicPropertiesMap = {
  $el: (i: any) => {
    return i.vnode.el;
  }
};

export const PublicInstanceProxyHandlers = {
  get({ _: instance }: any, key: any) {
    const { setupState } = instance;

    if (key in publicPropertiesMap) {
      const publicGetter = publicPropertiesMap[key as keyof typeof publicPropertiesMap];
      return publicGetter(instance);
    }

    return setupState[key];
  }
};
