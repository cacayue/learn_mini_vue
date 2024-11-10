import { h, ref, nextTick, getCurrentInstance } from '../../lib/guide-mini-vue.esm.js';

export const App = {
  name: 'App',
  setup() {
    const count = ref(0);
    const instance = getCurrentInstance();
    const onClick = () => {
      for (let i = 0; i < 100; i++) {
        count.value++;
      }

      console.log(instance.vNode.el.innerText);

      nextTick(() => {
        console.log(instance.vNode.el.innerText);
      })

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
