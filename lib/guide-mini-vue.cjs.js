'use strict';

function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type
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
}
function handleSetupResult(instance, setupResult) {
    // TODO function
    // object
    if (!setupResult && typeof setupResult === 'object') {
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
    patch(vnode);
}
function patch(vnode, container) {
    // TODO ElementComponent
    processComponent(vnode);
}
function processComponent(vnode, container) {
    mountComponent(vnode);
}
function mountComponent(vnode, container) {
    var instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance);
}
function setupRenderEffect(instance, container) {
    if (instance.render) {
        const subTree = instance.render();
        // vnode => element => mountElement
        patch(subTree);
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
            render(vnode);
        }
    };
};

function h(type, props, children) {
    return createVNode(type, props, children);
}

exports.createApp = createApp;
exports.h = h;
