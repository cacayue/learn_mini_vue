let targetMap = new WeakMap();
function track(target, key) {
    // target -> key -> fn
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }
    let dep = depsMap.get(key);
    if (!dep) {
        dep = new Set();
        depsMap.set(key, dep);
    }
}
function trigger(target, key) {
    var _a;
    const dep = (_a = targetMap.get(target)) === null || _a === void 0 ? void 0 : _a.get(key);
    if (dep) {
        triggerEffects(dep);
    }
}
function triggerEffects(dep) {
    var _a;
    for (const effect of dep) {
        if (effect.Option && ((_a = effect.Option) === null || _a === void 0 ? void 0 : _a.scheduler)) {
            effect.Option.scheduler();
        }
        else {
            effect.run();
        }
    }
}

const extend = Object.assign;
function isObject(params) {
    return params !== null && typeof params === 'object';
}
function hasOwn(obj, key) {
    return obj && Object.prototype.hasOwnProperty.call(obj, key);
}

const get = CreateGetter();
const set = CreateSetter();
const readonlyGet = CreateGetter(true);
const shadowReadonlyGet = CreateGetter(true, true);
function CreateGetter(isReadonly = false, isShadow = false) {
    return function get(target, key) {
        if (key === isReactiveFlags.IS_REACTIVE) {
            return !isReadonly;
        }
        else if (key === isReactiveFlags.IS_READONLY) {
            return isReadonly;
        }
        const res = Reflect.get(target, key);
        if (isObject(res) && !isShadow) {
            return isReadonly ? readonly(res) : reactive(res);
        }
        if (!isReadonly) {
            // 1 收集依赖
            track(target, key);
        }
        return res;
    };
}
function CreateSetter(isReadonly = false) {
    return function set(target, key, value) {
        const res = Reflect.set(target, key, value);
        // 2 触发依赖更新
        trigger(target, key);
        return res;
    };
}
const mutableHandler = {
    get,
    set
};
const readonlyHandler = {
    get: readonlyGet,
    set(target, key) {
        console.warn(`${target} is readOnly,${key} can not be set.`);
        return true;
    }
};
const shadowReadonlyHandler = extend({}, readonlyHandler, {
    get: shadowReadonlyGet
});

var isReactiveFlags;
(function (isReactiveFlags) {
    isReactiveFlags["IS_REACTIVE"] = "__v_isReactive";
    isReactiveFlags["IS_READONLY"] = "__v_isReadonly";
})(isReactiveFlags || (isReactiveFlags = {}));
function reactive(raw) {
    return createActiveProxy(raw, mutableHandler);
}
function readonly(raw) {
    return createActiveProxy(raw, readonlyHandler);
}
function shadowReadonly(raw) {
    return createActiveProxy(raw, shadowReadonlyHandler);
}
function createActiveProxy(raw, baseHandler) {
    if (!raw) {
        return;
    }
    return new Proxy(raw, baseHandler);
}

const publicPropertiesMap = {
    $el: (i) => {
        return i.vnode.el;
    }
};
const PublicInstanceProxyHandlers = {
    get({ _: instance }, key) {
        const { setupState, props } = instance;
        if (hasOwn(setupState, key)) {
            return setupState[key];
        }
        else if (hasOwn(props, key)) {
            return props[key];
        }
        if (key in publicPropertiesMap) {
            const publicGetter = publicPropertiesMap[key];
            if (publicGetter) {
                return publicGetter(instance);
            }
        }
    }
};

function initProps(instance, props) {
    instance.props = props;
    return instance;
}

function createComponentInstance(vnode) {
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
function setupComponent(instance) {
    initProps(instance, instance.vnode.props);
    initSlots(instance.vnode.slots);
    setupStatefulComponent(instance);
}
function initSlots(slots) {
    // TODO
}
function setupStatefulComponent(instance) {
    const Component = instance.type;
    const { props } = instance;
    const { setup } = Component;
    if (setup) {
        const setupResult = setup(shadowReadonly(props));
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

export { createApp, h };
