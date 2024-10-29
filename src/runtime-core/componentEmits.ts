import { convertFirstUpperCase, hasOwn } from '../Shared/index';

export function emit(instance: any, event: string, ...args: any[]) {
  const { props } = instance;
  const onKey = handlerOnName(event);
  if (hasOwn(props, onKey)) {
    const emitFunc = props[onKey];
    if (emitFunc) {
      emitFunc(...args);
    }
  }
  const key = handlerName(event);
  if (hasOwn(props, key)) {
    const emitFunc = props[key];
    if (emitFunc) {
      emitFunc(...args);
    }
  }
}

function handlerOnName(event: string) {
  const onKey = `on${convertFirstUpperCase(event)}`;
  return onKey;
}

function handlerName(event: string) {
  var arr = event.split('-');
  for (var i = 0; i < arr.length; i++) {
    arr[i] = convertFirstUpperCase(arr[i]);
  }
  return `on${arr.join('')}`;
}
