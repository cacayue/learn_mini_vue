// 使用位运算进行高效执行
// 1. 修改 |运算符
// 0010 | 0001 = 0011
// 2. 查询 &运算符
// 0010 & 0001 = 0000
export const enum ShapeFlags {
  ELEMENT = 1, // 0001
  STATEFUL_COMPONENT = 1 << 1, // 0010
  TEXT_CHILDREN = 1 << 2, // 0100
  ARRAY_CHILDREN = 1 << 3, // 1000
  SLOT_CHILDREN = 1 << 4 // 1000
}
