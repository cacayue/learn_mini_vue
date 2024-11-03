// Vue3 Init
import { createRender } from '../../lib/guide-mini-vue.esm.js';
import { App } from './App.js';

const app = new PIXI.Application();
await app.init({ background: '#1099bb', width: 640, height: 360 });
document.body.appendChild(app.view);

const render = createRender({
  createElement(type) {
    if (type === 'rect') {
      const rect = new PIXI.Graphics();
      rect.beginFill(0xffd9b3);
      rect.drawRect(0, 0, 100, 100);
      rect.endFill();
      return rect;
    }
  },
  patchProp(el, key, value) {
    el[key] = value;
  },
  insert(el, parent) {
    parent.addChild(el);
  }
});

render.createApp(App).mount(app.stage);
