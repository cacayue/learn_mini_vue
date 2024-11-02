import { h, createTextVNode, getCurrentInstance } from '../../lib/guide-mini-vue.esm.js';
import { Foo } from './foo.js';

export const App = {
  name: 'App',
  setup() {
    const instance = getCurrentInstance();
    console.log(instance, 'getCurrentInstance');

    return {};
  },
  render() {
    const app = h('div', {}, 'App');
    //const foo = h(Foo, {}, [h('p', {}, '123'), h('p', {}, '223')]);
    //const foo = h(Foo, {}, h('p', {}, '223'));
    // 具名插槽
    const foo = h(
      Foo,
      {},
      {
        header: ({ age, ha }) => [
          h('p', {}, `123: ${ha} + ${age}`),
          h('p', {}, '223:' + age),
          createTextVNode('text children')
        ],
        //header: ({ age, ha }) => h('p', {}, `123: ${ha} + ${age}`),
        footer: () => h('p', {}, '223')
      }
    );

    return h('div', {}, [app, foo]);
  }
};
