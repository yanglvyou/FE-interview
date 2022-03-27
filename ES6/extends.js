// new 、Object.create、 Object.setPrototypeOf、 __proto__ 优缺点；
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain

class A {
}

class B {
}

// B 的实例继承 A 的实例
Object.setPrototypeOf(B.prototype, A.prototype);

// B 继承 A 的静态属性
Object.setPrototypeOf(B, A);

const b = new B();


Object.setPrototypeOf(B.prototype, A.prototype);
// 等同于
B.prototype.__proto__ = A.prototype;

Object.setPrototypeOf(B, A);
// 等同于
B.__proto__ = A;





// ES5 实现ES6 extends的例子
function Parent(name) {
  this.name = name;
}


Parent.sayHello = function () {
  console.log("hello");
};


Parent.prototype.sayName = function () {
  console.log("my name is " + this.name);
  return this.name;
};

function Child(name, age) {
  // 相当于super
  Parent.call(this, name);
  this.age = age;
}



function _inherits(Child, Parent) {
  // Object.create
  Child.prototype = Object.create(Parent.prototype);
  // Object.setPrototypeOf(Child.prototype, Parent.prototype);
  // __proto__
  // Child.prototype.__proto__ = Parent.prototype;
  Child.prototype.constructor = Child;
  // ES6
  // Object.setPrototypeOf(Child, Parent);
  // __proto__

  // 子类构造函数的__proto__指向父类构造器，继承父类的静态方法
  Child.__proto__ = Parent;
  // Object.setPrototypeOf(Child,Parent)
}

_inherits(Child, Parent);

Child.prototype.sayAge = function () {
  console.log("my age is " + this.age);
  return this.age;
};

var parent = new Parent("Parent");
var child = new Child("Child", 18);

console.log("parent: ", parent); // parent:  Parent {name: "Parent"}
Parent.sayHello(); // hello
parent.sayName(); // my name is Parent
console.log("child: ", child); // child:  Child {name: "Child", age: 18}
Child.sayHello(); // hello
child.sayName(); // my name is Child
child.sayAge(); // my age is 18
