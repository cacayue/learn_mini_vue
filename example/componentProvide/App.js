import { h, provide, inject } from '../../lib/guide-mini-vue.esm.js';

const Provide = {
  name: 'Provide',
  setup() {
    provide('foo', 'fooVal');
    provide('bar', 'barVal');
    return {};
  },
  render() {
    return h('div', {}, [h('p', {}, 'Provide'), h(ProvideTwo)]);
  }
};

const ProvideTwo = {
  name: 'ProvideTwo',
  setup() {
    provide('foo', 'fooValTwo');
    const foo = inject('foo');
    return { foo };
  },
  render() {
    return h('div', {}, [h('p', {}, `ProvideTwo: ${this.foo}`), h(Consumer)]);
  }
};

const Consumer = {
  name: 'Consumer',
  setup() {
    const foo = inject('foo');
    const bar = inject('bar');
    return { foo, bar };
  },
  render() {
    return h('div', {}, `Consumer : -${this.foo}-${this.bar}`);
  }
};

export default {
  name: 'App',
  setup() {
    return {};
  },
  render() {
    return h('div', {}, [h('p', {}, 'apiInject'), h(Provide)]);
  }
};
