export const App = {
  // .vue
  setup() {
    return {
      message: 'mini-vue'
    };
  },
  render() {
    return h('div', `hi, ${this.message}`);
  }
};
