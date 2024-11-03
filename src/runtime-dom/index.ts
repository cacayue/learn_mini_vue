import { createRender } from '../runtime-core/render';

function createElement(type: string) {
  // body
  return document.createElement(type);
}

function patchProp(el: any, key: any, element: any) {
  const isOn = (key: string) => /^on[A-Z]/.test(key);
  if (isOn(key)) {
    const event = key.slice(2).toLowerCase();
    el.addEventListener(event, element);
  } else {
    el.setAttribute(key, element);
  }
}

function insert(el: any, parent: any) {
  parent.append(el);
}

const render: any = createRender({ createElement, patchProp, insert });

export function createApp(...args: any) {
  return render.createApp(...args);
}

export * from '../runtime-core/index';
