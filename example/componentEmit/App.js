import { h } from '../../lib/guide-mini-vue.esm.js';
import { Foo } from './foo.js';

export const App = {
  name: 'App',
  setup() {
    return {};
  },
  render() {
    return h('div', {}, [
      h('div', {}, `App`),
      h(Foo, {
        // on + event
        onAdd(e1, e2) {
          console.log('App add', e1, e2);
        },
        onAddFoo(e1, e2) {
          console.log('App Add Foo', e1, e2);
        }
      })
    ]);
  }
};
