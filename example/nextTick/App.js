import { h, ref } from '../../lib/guide-mini-vue.esm.js';

export const App = {
  name: 'App',
  setup() {
    const count = ref(0);

    const onClick = () => {
      for (let i = 0; i < 100; i++) {
        count.value++;
      }
    };
    return {
      count,
      onClick,
    };
  },
  render() {
    return h(
      'div',
      {
        id: 'root',
        ...this.props
      },
      [
        h('div', {}, `count: ${this.count}`),
        h('button', { onClick: this.onClick }, 'click'),
      ]
    );
  }
};
