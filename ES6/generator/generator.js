// https://zhuanlan.zhihu.com/p/216060145

class Context {
  constructor(param) {
    console.log(param, "param");
    this.next = 0;
    this.prev = 0;
    this.done = false;
    this._send = param;
  }
  stop() {
    this.done = true;
  }
}

function gen$(context) {
  var a; // 新增代码
  while (1) {
    switch ((context.prev = context.next)) {
      case 0:
        context.next = 2;
        return "result1";

      case 2:
        a = context._send; //新增代码
        console.log(a);
        context.next = 4;
        return "result2";

      case 4:
        context.next = 6;
        return "result3";

      case 6:
        //新增代码
        context.stop();
        return undefined;

      default:
        return undefined;
    }
  }
}

let foo = function () {
  var context = new Context(222); //修改代码
  return {
    next: function () {
      const value = gen$(context);
      const done = context.done;
      return {
        value,
        done,
      };
    },
    next(){
      
    }
  };
};

// function* foo() {
//   var a = yield "result1";
//   console.log(a);
//   yield "result2";
//   yield "result3";
// }

const gen = foo();
console.log(gen.next());
console.log(gen.next(222));
console.log(gen.next());
console.log(gen.next());



function* numbers () {
  yield 1
  yield 2
  return 3
  yield 4
}

// 扩展运算符
[...numbers()] // [1, 2]

// Array.from 方法
Array.from(numbers()) // [1, 2]

// 解构赋值
let [x, y] = numbers();
x // 1
y // 2

// for...of 循环
for (let n of numbers()) {
  console.log(n)
}
// 1
// 2
