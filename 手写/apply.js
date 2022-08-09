//https://github.com/mqyqingfeng/Blog/issues/11
/**
 * 使用一个指定的 this 值和若干个指定的参数值的前提下调用某个函数或方法。
 * @param {*} context 
 * @param {*} args 
 * @returns 
 */
Function.prototype.myApply = function (context = window, args) {
  if (!Array.isArray(args)) {
    throw new TypeError("CreateListFromArrayLike called on non-object");
  }

  if (this === Function.prototype) return undefined;

  context = context || window;

  const fn = Symbol();
  context[fn] = this;

  let result;

  // if (Array.isArray(args)) {
  //   result = context[fn](...args);
  // } else {
  //   result = context[fn]();
  // }

  result = context[fn](...args);

  delete context[fn];

  return result;
};
// call() 方法在使用一个指定的 this 值和若干个指定的参数值的前提下调用某个函数或方法。

Function.prototype.myCall = function (context = window, ...args) {
  
  if (this === Function.prototype) return undefined;

  context = context || window;
  const fn = Symbol();
  context[fn] = this;
  const result = context[fn](...args);
  delete context[fn];
  return result;
};
