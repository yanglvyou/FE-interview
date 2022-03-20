// https://www.imooc.com/read/38/article/481S

// 单例模式 （Singleton Pattern）又称为单体模式，保证一个类只有一个实例，并提供一个访问它的全局访问点。
//也就是说，第二次使用同一个类创建新对象的时候，应该得到与第一次创建的对象完全相同的对象。
class ManageGame {
  static _schedule = null;

  static getInstance() {
    if (ManageGame._schedule) {
      // 判断是否已经有单例了
      return ManageGame._schedule;
    }
    return (ManageGame._schedule = new ManageGame());
  }

  constructor() {
    if (ManageGame._schedule) {
      // 判断是否已经有单例了
      return ManageGame._schedule;
    }
    ManageGame._schedule = this;
  }
}

const schedule1 = new ManageGame();
const schedule2 = ManageGame.getInstance();

console.log(schedule1 === schedule2); // true

// 上面方法的缺点在于维护的实例作为静态属性直接暴露，外部可以直接修改。

const Singleton = (function () {
  let _instance = null; // 存储单例

  const Singleton = function () {
    if (_instance) return _instance; // 判断是否已有单例
    _instance = this;
    this.init(); // 初始化操作
    return _instance;
  };

  Singleton.prototype.init = function () {
    this.foo = "Singleton Pattern";
  };

  Singleton.getInstance = function () {
    if (_instance) return _instance;
    _instance = new Singleton();
    return _instance;
  };

  return Singleton;
})();

const visitor1 = new Singleton();
const visitor2 = new Singleton(); // 既可以 new 获取单例
const visitor3 = Singleton.getInstance(); // 也可以 getInstance 获取单例

console.log(visitor1 === visitor2); // true
console.log(visitor1 === visitor3); // true
// 代价和上例一样是闭包开销，并且因为 IIFE 操作带来了额外的复杂度，让可读性变差。

/**
 * 模块: 单例模式
 *
 * 功能: 模块模式方式
 */

// const Singleton = (function () {
//   let _instance = null; // 存储单例

//   const Singleton = function () {
//     if (_instance) return _instance; // 判断是否已有单例
//     _instance = this;
//     this.init(); // 初始化操作
//     return _instance;
//   };

//   Singleton.prototype.init = function () {
//     this.foo = "Singleton Pattern";
//   };

//   return {
//     getInstance(bar) {
//       if (_instance) return _instance;
//       _instance = new Singleton(bar);
//       return _instance;
//     },
//   };
// })();

// const visitor1 = Singleton.getInstance();
// const visitor2 = Singleton.getInstance();

// console.log(visitor1 === visitor2); // true
