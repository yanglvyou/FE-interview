// https://juejin.cn/post/6844903872847151112

// https://github.com/mqyqingfeng/Blog/issues/16

// 第一种方式是借助call实现继承

// 这样写的时候子类虽然能够拿到父类的属性值，但是问题是父类原型对象中一旦存在方法那么子类无法继承

function Parent1() {
  this.name = "parent1";
}
function Child1() {
  Parent1.call(this);
  this.type = "child1";
}
console.log(new Child1());

// 第二种方式借助原型链实现继承
function Parent2() {
  this.name = "parent2";
  this.play = [1, 2, 3];
}
function Child2() {
  this.type = "child2";
}
Child2.prototype = new Parent2();

console.log(new Child2());

var s1 = new Child2();
var s2 = new Child2();
s1.play.push(4);
console.log(s1.play, s2.play); // 明明我只改变了s1的play属性，为什么s2也跟着变了呢？很简单，因为两个实例使用的是同一个原型对象。

// 将前两种组合
function Parent3() {
  this.name = "parent3";
  this.play = [1, 2, 3];
}
function Child3() {
  Parent3.call(this);
  this.type = "child3";
}

Child3.prototype = new Parent3();
var s3 = new Child3();
var s4 = new Child3();
s3.play.push(4);
console.log(s3.play, s4.play);

function Parent4() {
  this.name = "parent4";
  this.play = [1, 2, 3];
}
function Child4() {
  Parent4.call(this);
  this.type = "child4";
}
Child4.prototype = Parent4.prototype;


// 寄生组合式继承
function Parent5() {
  this.name = "parent5";
  this.play = [1, 2, 3];
}
function Child5() {
  Parent5.call(this);
  this.type = "child5";
}
Child5.prototype = Object.create(Parent5.prototype);
Child5.prototype.constructor = Child5;

