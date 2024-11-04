import { h } from '../../lib/guide-mini-vue.esm.js';
import { ArrayToText } from './ArrayToText.js';

export const App = {
  name: 'App',
  setup() {
    return {};
  },
  render() {
    return h(
      'div',
      {
        tid: 1
      },
      [
        h('p', {}, `主页`),
        // 老的是array, 新的是text
        h(ArrayToText)
        // 老的是Text, 新的是array
      ]
    );
  }
};