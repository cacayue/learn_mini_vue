import { h } from '../../lib/guide-mini-vue.esm.js';

export const App = {
  // .vue
  setup() {
    return {
      message: 'mini-vue'
    };
  },
  render() {
    // return h('div', `hi, ${this.message}`);
    return h(
      'div',
      {
        class: 'red, blue'
      },
      [
        h(
          'p',
          {
            class: 'red'
          },
          `LOL, ${this.message}`
        ),
        h(
          'p',
          {
            class: 'blue'
          },
          'mini-vue'
        )
      ]
    );
  }
};
