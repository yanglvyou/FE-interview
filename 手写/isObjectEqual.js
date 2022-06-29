// JavaScript专题之如何判断两个对象相等 https://github.com/mqyqingfeng/Blog/issues/41
function isObjectEqual(a = {}, b = {}) {
  if (!a || !b) return a === b;
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);

  if (aKeys.length !== bKeys.length) return false;

  return aKeys.every((key) => {
    const aVal = a[key];
    const bVal = b[key];

    if (typeof aVal === "object" && typeof bVal === "object") {
      return isObjectEqual(aVal, bVal);
    }
    // return String(aVal) === String(bVal);
    return Object.is(aVal, bVal); 
  });
}
