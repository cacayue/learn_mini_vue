import { h } from '../../lib/guide-mini-vue.esm.js';

window.self = null;

export const App = {
  // .vue
  setup() {
    return {
      message: 'mini-vue'
    };
  },
  render() {
    window.self = this;
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
            class: 'red',
            onClick() {
              console.log('clicked');
            },
            onMousedown() {
              console.log('mousedown');
            }
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
