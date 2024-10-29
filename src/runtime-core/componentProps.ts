import { shadowReadonly } from '../reactivity/reactive';

export function initProps(instance: any, props: any) {
  instance.props = props;
  return instance;
}
