// instanceof 运算符用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上。
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/instanceof
function new_instance_of(leftValue, rightValue) {
  //基本数据类型直接返回false
  if (typeof leftValue !== "object" || leftValue === null) return false;

  let rightProto = rightValue.prototype; // 取右表达式的 prototype 值
  // leftValue = leftValue.__proto__; // 取左表达式的__proto__值
  leftValue = Object.getPrototypeOf(leftValue); // 取左表达式的__proto__值
  while (true) {
    if (leftValue === null) {
      return false;
    }
    if (leftValue === rightProto) {
      return true;
    }
    // leftValue = leftValue.__proto__;
    leftValue = Object.getPrototypeOf(leftValue);
  }
}

// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/isPrototypeOf

// isPrototypeOf() 方法用于测试一个对象是否存在于另一个对象的原型链上
// 备注：isPrototypeOf() 与 instanceof 运算符不同。在表达式 "object instanceof AFunction"中，
//object 的原型链是针对 AFunction.prototype 进行检查的，而不是针对 AFunction 本身。

function isPrototype(Aobj, Bobj) {
  let proto = Bobj.__proto__;
  while (proto) {
    if (proto === Aobj) {
      return true;
    } else {
      proto = proto.__proto__;
    }
  }
  return false;
}

class Parent {}
class Child extends Parent {}
class Grandson extends Child {}

isPrototype(Parent, Grandson); // true
