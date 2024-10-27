function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        render: undefined,
        proxy: undefined
    };
    return component;
}
function setupComponent(instance) {
    initProps(instance.vnode.props);
    initSlots(instance.vnode.slots);
    setupStatefulComponent(instance);
}
function initProps(props) {
    // TODO
}
function initSlots(slots) {
    // TODO
}
function setupStatefulComponent(instance) {
    const Component = instance.type;
    const { setup } = Component;
    if (setup) {
        const setupResult = setup();
        handleSetupResult(instance, setupResult);
    }
    instance.proxy = new Proxy({}, {
        get(target, key) {
            const { setupState } = instance;
            return setupState[key];
        }
    });
}
function handleSetupResult(instance, setupResult) {
    // TODO function
    // object
    if (setupResult && typeof setupResult === 'object') {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    const Component = instance.type;
    if (Component.render) {
        instance.render = Component.render;
    }
}

function render(vnode, container) {
    // call patch: 递归处理组件或者节点
    patch(vnode, container);
}
function patch(vnode, container) {
    const type = vnode.type;
    if (typeof type === 'string') {
        processElementComponent(vnode, container);
    }
    else if (typeof type === 'object') {
        processComponent(vnode, container);
    }
}
function processElementComponent(vnode, container) {
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    // 添加真实的el元素
    const { type, props, children } = vnode;
    const el = document.createElement(type);
    if (typeof children === 'string') {
        el.textContent = children;
    }
    else if (Array.isArray(children)) {
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
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
function mountComponent(vnode, container) {
    var instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance, container);
}
function setupRenderEffect(instance, container) {
    if (instance.render) {
        const { proxy } = instance;
        const subTree = instance.render.call(proxy);
        // vnode => element => mountElement
        patch(subTree, container);
    }
}

function createVNode(type, props, children) {
    let vnode = {
        type,
        props,
        children
    };
    return vnode;
}

const createApp = (rootComponent) => {
    return {
        mount(rootContainer) {
            // build vnode
            let vnode = createVNode(rootComponent);
            render(vnode, rootContainer);
        }
    };
};

function h(type, props, children) {
    return createVNode(type, props, children);
}

export { createApp, h };
