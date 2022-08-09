// https://zhuanlan.zhihu.com/p/499386347
// https://www.imweb.io/topic/598973c2c72aa8db35d2e291
function shallowEqual(objA, objB) {
  // 如果两个参数有相同的值，如原始值相等、或对象的引用相等，它们会被认为相等
  /**
   *  // 首先对基本数据类型的比较
   */
  if (Object.is(objA, objB)) {
    return true;
  }
  /**
   * // 由于Object.is()可以对基本数据类型做一个精确的比较， 所以如果不等
  // 只有一种情况是误判的，那就是object,所以在判断两个对象都不是object
  // 之后，就可以返回false了
   */
  if (
    typeof objA !== "object" ||
    objA === null ||
    typeof objB !== "object" ||
    objB === null
  ) {
    return false;
  }
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }
  for (let i = 0; i < keysA.length; i++) {
    if (
      !Object.prototype.hasOwnProperty.call(objB, keysA[i]) ||
      !Object.is(objA[keysA[i]], objB[keysA[i]])
    ) {
      return false;
    }
  }
  return true;
}
