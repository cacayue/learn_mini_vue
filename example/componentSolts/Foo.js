import { h, renderSlot } from '../../lib/guide-mini-vue.esm.js';

export const Foo = {
  setup() {},
  render() {
    const foo = h('p', {}, 'foo');
    // foo.vNode.children
    console.log(this.$slots);

    const age = 18;
    const ha = 'haha';
    // 具名插槽
    return h('div', {}, [
      renderSlot(this.$slots, 'b'),
      foo,
      renderSlot(this.$slots, 'a', {
        age,
        ha
      })
    ]);
  }
};
