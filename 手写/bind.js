//bind() 方法创建一个新的函数，在 bind() 被调用时，这个新函数的 this 被指定为 bind() 的第一个参数
//，而其余参数将作为新函数的参数，供调用时使用

//https://github.com/mqyqingfeng/Blog/issues/12

Function.prototype.myBind = function (context, ...args1) {
  if (typeof this !== "function") {
    throw new TypeError("Error");
  }
  const _this = this;
  return function F(...args2) {
    // 判断是否用于构造函数
    if (this instanceof F || new.target) {
      return new _this(...args1, ...args2);
    }
    return _this.apply(context, args1.concat(args2));
  };
};

// 也就是说当 bind 返回的函数作为构造函数的时候，bind 时指定的 this 值会失效，但传入的参数依然生效。
var value = 2;

var foo = {
  value: 1,
};

function bar(name, age) {
  this.habit = "shopping";
  console.log(this.value);
  console.log(name);
  console.log(age);
}

bar.prototype.friend = "kevin";

var bindFoo = bar.bind(foo, "daisy");

var obj = new bindFoo("18");
// undefined
// daisy
// 18
console.log(obj.habit);
console.log(obj.friend);
// shopping
// kevin
