// https://juejin.cn/post/7013309942576709640
function objectFlat(obj = "") {
  const res = {};

  function flat(item, preKey = "") {
    Object.entries(item).forEach(([key, value]) => {
      let newKey = key;
      if (Array.isArray(item)) {
        newKey = preKey ? `${preKey}[${key}]` : key;
      } else {
        newKey = preKey ? `${preKey}.${key}` : key;
      }
      if (value && typeof value === "object") {
        flat(value, newKey);
      } else {
        res[newKey] = value;
      }
    });
  }
  flat(obj);
  return res;
}

const source = { a: { b: { c: 1, d: 2 }, e: 3 }, f: { g: 2 } };
console.log(objectFlat(source));
const obj = {
  a: 1,
  b: [1, 2, { c: true }],
  c: { e: 2, f: 3 },
  g: null
};
console.log(objectFlat(obj));

//--------结果
// { 'a.b.c': 1, 'a.b.d': 2, 'a.e': 3, 'f.g': 2 }
// {
//   a: 1,
//   'b[0]': 1,
//   'b[1]': 2,
//   'b[2].c': true,
//   'c.e': 2,
//   'c.f': 3,
//   g: null
// }

