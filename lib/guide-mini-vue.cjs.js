'use strict';

const extend = Object.assign;
const EMPTY_OBJ = {};
function isObject(params) {
    return params !== null && typeof params === 'object';
}
function hasChanged(value, newValue) {
    return !Object.is(value, newValue);
}
function hasOwn(obj, key) {
    return obj && Object.prototype.hasOwnProperty.call(obj, key);
}
function convertFirstUpperCase(event) {
    return event.charAt(0).toUpperCase() + event.slice(1);
}

let activeEffect;
let shouldTrack = true;
class ReactiveEffect {
    constructor(fn, option) {
        this.active = true;
        this._fn = fn;
        this.Option = option;
        this.deps = [];
    }
    run() {
        if (!this.active) {
            return this._fn();
        }
        shouldTrack = true;
        activeEffect = this;
        const res = this._fn();
        shouldTrack = false;
        return res;
    }
    stop() {
        var _a, _b;
        if (this.active) {
            if (this.Option && ((_a = this.Option) === null || _a === void 0 ? void 0 : _a.onstop)) {
                this.Option.onstop();
            }
            (_b = this.deps) === null || _b === void 0 ? void 0 : _b.forEach((dep) => {
                dep.delete(this);
            });
            this.active = false;
        }
    }
}
function effect(fn, option) {
    const reactiveEffect = new ReactiveEffect(fn, option);
    reactiveEffect.run();
    const runner = reactiveEffect.run.bind(reactiveEffect);
    runner.effect = reactiveEffect;
    return runner;
}
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
    trackEffects(dep);
}
function isTracking() {
    return shouldTrack && activeEffect !== undefined;
}
function trackEffects(dep) {
    var _a;
    if (isTracking()) {
        dep.add(activeEffect);
        (_a = activeEffect.deps) === null || _a === void 0 ? void 0 : _a.push(dep);
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

class RefImpl {
    constructor(value) {
        this._v_isRef = true;
        this.dep = new Set();
        this._value = convertObj(value);
        this._rawValue = value;
    }
    get value() {
        trackEffects(this.dep);
        return this._value;
    }
    set value(newValue) {
        if (hasChanged(this._rawValue, newValue)) {
            this._value = convertObj(newValue);
            this._rawValue = newValue;
            triggerEffects(this.dep);
        }
    }
}
function convertObj(value) {
    return isObject(value) ? reactive(value) : value;
}
function ref(raw) {
    return new RefImpl(raw);
}
function proxyRefs(raw) {
    return new Proxy(raw, {
        get(target, key) {
            const res = Reflect.get(target, key);
            return unRef(res);
        },
        set(target, key, newValue) {
            const res = Reflect.get(target, key);
            if (!isRef(res) && !isRef(newValue)) {
                Reflect.set(target, key, newValue);
            }
            else if (isRef(res) && !isRef(newValue)) {
                res.value = newValue;
            }
            else if (isRef(res) && isRef(newValue)) {
                res.value = newValue.value;
            }
            return res;
        }
    });
}
function isRef(raw) {
    return !!raw._v_isRef;
}
function unRef(raw) {
    if (isRef(raw)) {
        return raw.value;
    }
    return raw;
}

const publicPropertiesMap = {
    $el: (i) => {
        return i.vnode.el;
    },
    $slots: (i) => {
        return i.slots;
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

function emit(instance, event, ...args) {
    const { props } = instance;
    const onKey = handlerOnName(event);
    if (hasOwn(props, onKey)) {
        const emitFunc = props[onKey];
        if (emitFunc) {
            emitFunc(...args);
        }
    }
    const key = handlerName(event);
    if (hasOwn(props, key)) {
        const emitFunc = props[key];
        if (emitFunc) {
            emitFunc(...args);
        }
    }
    const key2 = handlerName2(event);
    if (hasOwn(props, key2)) {
        const emitFunc = props[key2];
        if (emitFunc) {
            emitFunc(...args);
        }
    }
}
function handlerOnName(event) {
    const onKey = `on${convertFirstUpperCase(event)}`;
    return onKey;
}
function handlerName(event) {
    var arr = event.split('-');
    for (var i = 0; i < arr.length; i++) {
        arr[i] = convertFirstUpperCase(arr[i]);
    }
    return `on${arr.join('')}`;
}
function handlerName2(event) {
    var arr = event.split('-');
    for (var i = 1; i < arr.length; i++) {
        arr[i] = convertFirstUpperCase(arr[i]);
    }
    return `${arr.join('')}`;
}

function initProps(instance, props) {
    instance.props = props;
    return instance;
}

function initSlots(instance, children) {
    const { vNode } = instance;
    if (vNode.shapeFlag & 16 /* ShapeFlags.SLOT_CHILDREN */) {
        normalizeObjectSlots(children, instance.slots);
    }
}
function normalizeObjectSlots(children, slots) {
    for (const key in children) {
        const slot = children[key];
        if (typeof slot === 'function') {
            if (slot) {
                slots[key] = (props) => normalizeArraySlot(slot(props));
            }
            else {
                slots[key] = normalizeArraySlot(slot);
            }
        }
    }
}
function normalizeArraySlot(slot) {
    return Array.isArray(slot) ? slot : [slot];
}

function createComponentInstance(vNode, parent) {
    var _a;
    let component = {
        vNode,
        type: vNode.type,
        setupState: {},
        render: undefined,
        proxy: undefined,
        props: {},
        emit: () => { },
        slots: {},
        provides: (_a = parent === null || parent === void 0 ? void 0 : parent.provides) !== null && _a !== void 0 ? _a : {},
        parent: parent,
        isMounted: false,
        subTree: {}
    };
    component.emit = emit.bind(null, component);
    return component;
}
function setupComponent(instance) {
    initProps(instance, instance.vNode.props);
    initSlots(instance, instance.vNode.children);
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
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
function handleSetupResult(instance, setupResult) {
    // TODO function
    // object
    if (setupResult && typeof setupResult === 'object') {
        instance.setupState = proxyRefs(setupResult);
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    const Component = instance.type;
    if (Component.render) {
        instance.render = Component.render;
    }
}
let currentINstance;
function getCurrentInstance() {
    return currentINstance;
}
function setCurrentInstance(instance) {
    currentINstance = instance;
}

function createVNode(type, props, children) {
    let vNode = {
        type,
        props,
        children,
        $el: null,
        shapeFlag: 2 /* ShapeFlags.STATEFUL_COMPONENT */
    };
    if (typeof type === 'string') {
        vNode.shapeFlag = 1 /* ShapeFlags.ELEMENT */;
    }
    else if (typeof type === 'object') {
        vNode.shapeFlag = 2 /* ShapeFlags.STATEFUL_COMPONENT */;
    }
    if (typeof children === 'string') {
        vNode.shapeFlag |= 4 /* ShapeFlags.TEXT_CHILDREN */;
    }
    else if (Array.isArray(children)) {
        vNode.shapeFlag |= 8 /* ShapeFlags.ARRAY_CHILDREN */;
    }
    if (vNode.shapeFlag & 2 /* ShapeFlags.STATEFUL_COMPONENT */) {
        if (typeof children === 'object') {
            vNode.shapeFlag |= 16 /* ShapeFlags.SLOT_CHILDREN */;
        }
    }
    return vNode;
}
function createTextVNode(text) {
    return createVNode(Text, {}, text);
}

function createAppAPI(render) {
    return function createApp(rootComponent) {
        return {
            mount(rootContainer) {
                // build vNode
                let vNode = createVNode(rootComponent);
                render(vNode, rootContainer);
            }
        };
    };
}

const Fragment = Symbol('Fragment');
const Text = Symbol('Text');
function createRender(options) {
    const { createElement, patchProp, insert, remove, setTextContext } = options;
    function render(vNode, container) {
        // call patch: 递归处理组件或者节点
        patch(null, vNode, container, undefined);
    }
    function patch(n1, n2, container, parentComponent) {
        const { type, shapeFlag } = n2;
        if (type === Fragment) {
            processFragment(n2, container, parentComponent);
        }
        else if (type === Text) {
            processText(n2, container);
        }
        else if (shapeFlag & 1 /* ShapeFlags.ELEMENT */) {
            processElementComponent(n1, n2, container, parentComponent);
        }
        else if (shapeFlag & 2 /* ShapeFlags.STATEFUL_COMPONENT */) {
            processComponent(n2, container, parentComponent);
        }
    }
    function processText(vNode, container) {
        const { children } = vNode;
        const textNode = (vNode.el = document.createTextNode(children));
        container.append(textNode);
    }
    function processFragment(vNode, container, parentComponent) {
        mountChildren(vNode, container, parentComponent);
    }
    function processElementComponent(n1, n2, container, parentComponent) {
        if (!n1) {
            mountElement(n2, container, parentComponent);
        }
        else {
            patchElement(n1, n2);
        }
    }
    function patchElement(n1, n2, container, parentComponent) {
        let oldProps = n1.props || EMPTY_OBJ;
        let nextProps = n2.props || EMPTY_OBJ;
        let el = (n2.el = n1.el);
        // 更新Children
        patchChildren(n1, n2, el);
        // 更新props
        patchProps(el, oldProps, nextProps);
    }
    function patchChildren(n1, n2, container) {
        // 新的是Array
        const prevShapeFlag = n1.shapeFlag;
        const nextShapeFlag = n2.shapeFlag;
        const c2 = n2.children;
        if (nextShapeFlag & 4 /* ShapeFlags.TEXT_CHILDREN */) {
            if (prevShapeFlag & 8 /* ShapeFlags.ARRAY_CHILDREN */) {
                unmountChildren(n1);
                setTextContext(container, c2);
            }
        }
    }
    function unmountChildren(children) {
        for (let i = 0; i < children.length; i++) {
            const element = children[i].el;
            remove(element);
        }
    }
    function patchProps(el, oldProps, nextProps) {
        // 更新props
        if (oldProps !== nextProps) {
            for (const key in nextProps) {
                let prevVal = oldProps[key];
                let nextVal = nextProps[key];
                if (nextVal !== prevVal) {
                    patchProp(el, key, prevVal, nextVal);
                }
            }
        }
        if (oldProps !== EMPTY_OBJ) {
            for (const key in oldProps) {
                if (!(key in nextProps)) {
                    patchProp(el, key, oldProps[key], null);
                }
            }
        }
    }
    function mountChildren(vNode, container, parentComponent) {
        vNode.children.forEach((v) => {
            patch(null, v, container, parentComponent);
        });
    }
    function mountElement(vNode, container, parentComponent) {
        // 添加真实的el元素
        const { type, props, children, shapeFlag } = vNode;
        const el = (vNode.el = createElement(type));
        if (shapeFlag & 4 /* ShapeFlags.TEXT_CHILDREN */) {
            el.textContent = children;
        }
        else if (shapeFlag & 8 /* ShapeFlags.ARRAY_CHILDREN */) {
            mountChildren(vNode, el, parentComponent);
        }
        for (const key in props) {
            if (hasOwn(props, key)) {
                patchProp(el, key, null, props[key]);
            }
        }
        insert(el, container);
    }
    function processComponent(vNode, container, parentComponent) {
        mountComponent(vNode, container, parentComponent);
    }
    function mountComponent(vNode, container, parentComponent) {
        var instance = createComponentInstance(vNode, parentComponent);
        setupComponent(instance);
        setupRenderEffect(instance, vNode, container);
    }
    function setupRenderEffect(instance, vNode, container) {
        effect(() => {
            if (instance.render) {
                if (!instance.isMounted) {
                    const { proxy } = instance;
                    const subTree = (instance.subTree = instance.render.call(proxy));
                    patch(null, subTree, container, instance);
                    vNode.el = subTree.el;
                    instance.isMounted = true;
                }
                else {
                    const { proxy } = instance;
                    const subTree = instance.render.call(proxy);
                    const prevSubTree = instance.subTree;
                    instance.subTree = subTree;
                    patch(prevSubTree, subTree, container, instance);
                }
            }
        });
    }
    return {
        createApp: createAppAPI(render)
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

function renderSlot(slots, name, props) {
    const slot = slots[name];
    if (slot) {
        if (typeof slot === 'function') {
            return createVNode(Fragment, {}, slot(props));
        }
        else {
            return createVNode(Fragment, {}, slot);
        }
    }
}

function provide(key, value) {
    const instance = getCurrentInstance();
    if (instance) {
        let { provides } = instance;
        const parentProvide = instance.parent && instance.parent.provides;
        if (provides === parentProvide) {
            provides = instance.provides = Object.create(parentProvide);
        }
        provides[key] = value;
    }
}
function inject(key, defaultValue) {
    var _a;
    const instance = getCurrentInstance();
    if (instance) {
        const val = (_a = instance.parent) === null || _a === void 0 ? void 0 : _a.provides[key];
        if (val) {
            return val;
        }
        else {
            if (typeof defaultValue === 'function') {
                return defaultValue();
            }
            else {
                return defaultValue;
            }
        }
    }
}

function createElement(type) {
    // body
    return document.createElement(type);
}
function patchProp(el, key, oldValue, newValue) {
    const isOn = (key) => /^on[A-Z]/.test(key);
    if (isOn(key)) {
        const event = key.slice(2).toLowerCase();
        el.addEventListener(event, newValue);
    }
    else {
        if (newValue === undefined || newValue === null) {
            el.removeAttribute(key);
        }
        else {
            el.setAttribute(key, newValue);
        }
    }
}
function insert(el, parent) {
    parent.append(el);
}
function remove(el) {
    const parent = el.parentNode;
    if (parent) {
        parent.removeChild(el);
    }
}
function setTextContext(parent, text) {
    parent.textContent = text;
}
const render = createRender({ createElement, patchProp, insert, remove, setTextContext });
function createApp(...args) {
    return render.createApp(...args);
}

exports.createApp = createApp;
exports.createRender = createRender;
exports.createTextVNode = createTextVNode;
exports.effect = effect;
exports.getCurrentInstance = getCurrentInstance;
exports.h = h;
exports.inject = inject;
exports.provide = provide;
exports.proxyRefs = proxyRefs;
exports.ref = ref;
exports.renderSlot = renderSlot;
