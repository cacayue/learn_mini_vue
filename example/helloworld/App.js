import { h } from '../../lib/guide-mini-vue.esm.js';

export const App = {
  // .vue
  setup() {
    return {
      message: 'mini-vue'
    };
  },
  render() {
    const divContainer = document.querySelector('div');
    return h('div', `hi, ${this.message}`);
  }
};
