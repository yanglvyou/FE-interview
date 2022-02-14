// instanceof 运算符用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上。
function new_instance_of(leftValue, rightValue) {
  let rightProto = rightValue.prototype; // 取右表达式的 prototype 值
  leftValue = leftValue.__proto__; // 取左表达式的__proto__值
  while (true) {
    if (leftValue === null) {
      return false;
    }
    if (leftValue === rightProto) {
      return true;
    }
    leftValue = leftValue.__proto__;
  }
}
