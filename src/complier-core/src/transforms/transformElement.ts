import { CREATE_ELEMENT_BLOCK, helperNameMap } from '../complierHelper';
import { NodeType } from '../node';

export function transformElement(node: any, context: any) {
  // body
  if (node.type === NodeType.ELEMENT) {
    context.helper(helperNameMap.get(CREATE_ELEMENT_BLOCK));
  }
}
