//new 运算符创建一个用户定义的对象类型的实例或具有构造函数的内置对象的实例
// https://github.com/mqyqingfeng/Blog/issues/13

function myNew(fn, ...arg) {
  if (typeof fn !== "function") {
    throw new Error();
  }
  const obj = Object.create(fn.prototype);
  const res = fn.apply(obj, arg);
  // return typeof res === "object" ? res || obj : obj;
  return Object.prototype.toString.call(res) === "[object Object]" ? res : obj;
}

// new 关键字会进行如下的操作：

// 创建一个空的简单JavaScript对象（即{}）；
// 为步骤1新创建的对象添加属性__proto__，将该属性链接至构造函数的原型对象 ；
// 将步骤1新创建的对象作为this的上下文 ；
// 如果该函数没有返回对象，则返回this。

/**
 * 检测 new 的目标是不是非函数，如果是非函数，抛出错误
修改 new 的 target 属性，使之指向构造函数
新建一个空的实例对象。注意不能使用 Object.create 创建，否则当构造函数原型为 null 的时候，实例对象隐式原型也为 null，但根据 new 的规范，这里不是这样的。具体见 4。
检测构造函数原型是否为 null，如果不是，则将其作为实例对象的隐式原型，否则将 Object 的原型作为实例对象的隐式原型
执行构造函数，将其 this 指向实例对象，同时传入参数
获得构造函数返回值，判断是不是对象，如果是对象，则作为 new 的返回值，否则将实例对象作为 new 的返回值
 */
// https://github.com/BetaSu/fe-hunter/issues/15#issuecomment-1078625200
function myNew(Fn, ...args) {
  // 检测异常
  if (typeof Fn != "function") {
    throw new TypeError(Fn + "is not a constructor");
  }
  // 修改 target 属性
  myNew.target = Fn;
  // 创建空的实例对象
  const instance = {};
  // 检测构造函数原型是不是对象
  instance.__proto__ =
    Fn.prototype instanceof Object ? Fn.prototype : Object.prototype;
  // 执行构造函数
  const returnValue = Fn.call(instance, ...args);
  // 决定 new 的返回值
  return returnValue instanceof Object ? returnValue : instance;
}

// 构造函数原型不为空的情况
function Student(name, age) {
  this.name = name;
  this.age = age;
}
const student1 = myNew(Student, "Jack", 20);
const student2 = new Student("Jack", 20);
console.log(student1); // {name:'Jack',age:20}
console.log(student2); // {name:'Jack',age:20}

// 构造函数原型为空的情况
function Fn() {}
Fn.prototype = null;
const fn1 = myNew(Fn);
const fn2 = new Fn();
Object.getPrototypeOf(fn1) === Object.prototype; // true
Object.getPrototypeOf(fn2) === Object.prototype; // true
