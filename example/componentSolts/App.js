import { h } from '../../lib/guide-mini-vue.esm.js';
import { Foo } from './foo.js';

export const App = {
  name: 'App',
  setup() {
    return {};
  },
  render() {
    const app = h('div', {}, 'App');
    //const foo = h(Foo, {}, [h('p', {}, '123'), h('p', {}, '223')]);
    const foo = h(Foo, {}, h('p', {}, '223'));

    return h('div', {}, [app, foo]);
  }
};
