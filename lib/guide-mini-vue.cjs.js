'use strict';

const publicPropertiesMap = {
    $el: (i) => {
        return i.vnode.el;
    }
};
const PublicInstanceProxyHandlers = {
    get({ _: instance }, key) {
        const { setupState } = instance;
        if (key in publicPropertiesMap) {
            const publicGetter = publicPropertiesMap[key];
            return publicGetter(instance);
        }
        return setupState[key];
    }
};

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
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
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

function render(vNode, container) {
    // call patch: 递归处理组件或者节点
    patch(vNode, container);
}
function patch(vNode, container) {
    const { shapeFlag } = vNode;
    if (shapeFlag & 1 /* ShapeFlags.ELEMENT */) {
        processElementComponent(vNode, container);
    }
    else if (shapeFlag & 2 /* ShapeFlags.STATEFUL_COMPONENT */) {
        processComponent(vNode, container);
    }
}
function processElementComponent(vNode, container) {
    mountElement(vNode, container);
}
function mountElement(vNode, container) {
    // 添加真实的el元素
    const { type, props, children, shapeFlag } = vNode;
    const el = (vNode.el = document.createElement(type));
    if (shapeFlag & 4 /* ShapeFlags.TEXT_CHILDREN */) {
        el.textContent = children;
    }
    else if (shapeFlag & 8 /* ShapeFlags.ARRAY_CHILDREN */) {
        children.forEach((v) => {
            patch(v, el);
        });
    }
    for (const key in props) {
        if (Object.prototype.hasOwnProperty.call(props, key)) {
            const element = props[key];
            const isOn = (key) => /^on[A-Z]/.test(key);
            if (isOn(key)) {
                const event = key.slice(2).toLowerCase();
                el.addEventListener(event, element);
            }
            else {
                el.setAttribute(key, element);
            }
        }
    }
    container.append(el);
}
function processComponent(vNode, container) {
    mountComponent(vNode, container);
}
function mountComponent(vNode, container) {
    var instance = createComponentInstance(vNode);
    setupComponent(instance);
    setupRenderEffect(instance, vNode, container);
}
function setupRenderEffect(instance, vNode, container) {
    if (instance.render) {
        const { proxy } = instance;
        const subTree = instance.render.call(proxy);
        // vNode => element => mountElement
        patch(subTree, container);
        vNode.el = subTree.el;
    }
}

function createVNode(type, props, children) {
    let vnode = {
        type,
        props,
        children,
        $el: null,
        shapeFlag: 2 /* ShapeFlags.STATEFUL_COMPONENT */
    };
    if (typeof type === 'string') {
        vnode.shapeFlag = 1 /* ShapeFlags.ELEMENT */;
    }
    else if (typeof type === 'object') {
        vnode.shapeFlag = 2 /* ShapeFlags.STATEFUL_COMPONENT */;
    }
    if (typeof children === 'string') {
        vnode.shapeFlag |= 4 /* ShapeFlags.TEXT_CHILDREN */;
    }
    else if (Array.isArray(children)) {
        vnode.shapeFlag |= 8 /* ShapeFlags.ARRAY_CHILDREN */;
    }
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

exports.createApp = createApp;
exports.h = h;
