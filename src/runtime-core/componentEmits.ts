import { convertFirstUpperCase, hasOwn } from '../Shared/index';

export function emit(instance: any, event: string) {
  const { props } = instance;
  const key = `on${convertFirstUpperCase(event)}`;
  if (hasOwn(props, key)) {
    const emitFunc = props[key];
    if (emitFunc) {
      emitFunc();
    }
  }
}
