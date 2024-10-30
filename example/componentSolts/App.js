import { h } from '../../lib/guide-mini-vue.esm.js';
import { Foo } from './foo.js';

export const App = {
  name: 'App',
  setup() {
    return {};
  },
  render() {
    const app = h('div', {}, 'App');
    const foo = h(Foo);

    return h('div', {}, [app, foo]);
  }
};