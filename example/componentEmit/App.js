import { h } from '../../lib/guide-mini-vue.esm.js';
import { Foo } from './foo.js';

export const App = {
  name: 'App',
  setup() {
    return {};
  },
  render() {
    // return h('div', {}, [
    //   // h('div', {}, `App`),
    //   h(Foo, {
    //     // on + event
    //     onAdd() {
    //       console.log('App add');
    //     }
    //   })
    // ]);
    return h(Foo, {
      // on + event
      onAdd() {
        console.log('App add');
      }
    });
  }
};
