import { h } from '../../lib/guide-mini-vue.esm.js';

export const Foo = {
  setup(props, { emit }) {
    const emitAdd = () => {
      emit('add', 1, 2);
      emit('add-foo', 1, 2);
    };

    const emitAddFoo = () => {
      emit('add-foo', 1, 3);
    };

    return {
      emitAdd,
      emitAddFoo
    };
  },
  render() {
    const btn1 = h(
      'button',
      {
        onClick: this.emitAdd
      },
      'emitAdd'
    );
    const btn2 = h(
      'button',
      {
        onClick: this.emitAddFoo
      },
      'emitAddFoo'
    );

    const foo = h('p', {}, 'foo');
    return h('div', {}, [foo, btn1, btn2]);
  }
};
