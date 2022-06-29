// https://github.com/lodash/lodash/blob/master/flow.js
export default function compose(...funcs) {
  // if (funcs.length === 0) {
  //   return (arg) => arg;
  // }
  // if (funcs.length === 1) return funcs[0];

  // return funcs.reduce(
  //   (a, b) =>
  //     (...args) =>
  //       a(b(...args))
  // );

  funcs = funcs.reverse();

  const length = funcs.length;
  let index = length;
  while (index--) {
    if (typeof funcs[index] !== "function") {
      throw new TypeError("Expected a function");
    }
  }
  return function (...args) {
    let index = 0;
    let result = length ? funcs[index].apply(this, args) : args[0];
    while (++index < length) {
      result = funcs[index].call(this, result);
    }
    return result;
  };
}
