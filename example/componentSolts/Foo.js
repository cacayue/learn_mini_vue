import { h } from '../../lib/guide-mini-vue.esm.js';

export const Foo = {
  setup() {},
  render() {
    const foo = h('p', {}, 'foo');
    // foo.vNode.children
    console.log(this.$slots);

    return h('div', {}, [foo, this.$slots]);
  }
};
