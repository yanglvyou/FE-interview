//new 运算符创建一个用户定义的对象类型的实例或具有构造函数的内置对象的实例
// https://github.com/mqyqingfeng/Blog/issues/13
function myNew(fn, ...arg) {
  if (typeof fn !== "function") {
    throw new Error();
  }
  const obj = Object.create(fn.prototype);
  const res = fn.apply(obj, arg);
  return typeof res === "object" ? res || obj : obj;
  return Object.prototype.toString.call(res) === "[object Object]" ? res : obj;
}

// new 关键字会进行如下的操作：

// 创建一个空的简单JavaScript对象（即{}）；
// 为步骤1新创建的对象添加属性__proto__，将该属性链接至构造函数的原型对象 ；
// 将步骤1新创建的对象作为this的上下文 ；
// 如果该函数没有返回对象，则返回this。
