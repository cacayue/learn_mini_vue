import { h } from "../../lib/guide-mini-vue.esm.js";
export default {
  name: "Child",
  setup() { },
  render() {
    return h("div", {}, [h("div", {}, "child - props -" + this.$props.msg)]);
  },
};
