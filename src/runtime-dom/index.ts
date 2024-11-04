import { createRender } from '../runtime-core/render';

function createElement(type: string) {
  // body
  return document.createElement(type);
}

function patchProp(el: any, key: any, oldValue: any, newValue: any) {
  const isOn = (key: string) => /^on[A-Z]/.test(key);
  if (isOn(key)) {
    const event = key.slice(2).toLowerCase();
    el.addEventListener(event, newValue);
  } else {
    if (newValue === undefined || newValue === null) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, newValue);
    }
  }
}

function insert(el: any, parent: any) {
  parent.append(el);
}

function remove(el: any) {
  const parent = el.parentNode;
  if (parent) {
    parent.removeChild(el);
  }
}

function setTextContext(parent: any, text: string) {
  parent.textContent = text;
}

const render: any = createRender({ createElement, patchProp, insert, remove, setTextContext });

export function createApp(...args: any) {
  return render.createApp(...args);
}

export * from '../runtime-core/index';
