// https://mp.weixin.qq.com/s/4UvbkOGHBg0OFsLyMHlxVQ

// https://es6.ruanyifeng.com/#docs/async

/**
 * async 函数的实现原理，就是将 Generator 函数和自动执行器，包装在一个函数里。
 *
 */

async function fn(args) {
  // ...
}

// 等同于

function fn(args) {
  return spawn(function* () {
    // ...
  });
}

function spawn(genF) {
  return new Promise(function (resolve, reject) {
    const gen = genF();
    function step(nextF) {
      let next;
      try {
        next = nextF();
      } catch (e) {
        return reject(e);
      }
      if (next.done) {
        return resolve(next.value);
      }
      Promise.resolve(next.value).then(
        function (v) {
          step(function () {
            return gen.next(v);
          });
        },
        function (e) {
          step(function () {
            return gen.throw(e);
          });
        }
      );
    }
    step(function () {
      return gen.next(undefined);
    });
  });
}

// https://juejin.cn/post/7007031572238958629

function generatorToAsync(generatorFn) {
  return function () {
    const gen = generatorFn.apply(this, arguments); // gen有可能传参

    // 返回一个Promise
    return new Promise((resolve, reject) => {
      function go(key, arg) {
        let res;
        try {
          res = gen[key](arg); // 这里有可能会执行返回reject状态的Promise
        } catch (error) {
          return reject(error); // 报错的话会走catch，直接reject
        }

        // 解构获得value和done
        const { value, done } = res;
        if (done) {
          // 如果done为true，说明走完了，进行resolve(value)
          return resolve(value);
        } else {
          // 如果done为false，说明没走完，还得继续走

          // value有可能是：常量，Promise，Promise有可能是成功或者失败
          return Promise.resolve(value).then(
            (val) => go("next", val),
            (err) => go("throw", err)
          );
        }
      }

      go("next"); // 第一次执行
    });
  };
}

function fn(nums) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(nums * 2);
    }, 1000);
  });
}

const asyncFn = generatorToAsync(gen);

asyncFn().then((res) => console.log(res));

async function asyncFn() {
  const num1 = await fn(1);
  console.log(num1); // 2
  const num2 = await fn(num1);
  console.log(num2); // 4
  const num3 = await fn(num2);
  console.log(num3); // 8
  return num3;
}
const asyncRes = asyncFn();
console.log(asyncRes); // Promise
asyncRes.then((res) => console.log(res)); // 8

function* gen() {
  const num1 = yield fn(1);
  console.log(num1); // 2
  const num2 = yield fn(num1);
  console.log(num2); // 4
  const num3 = yield fn(num2);
  console.log(num3); // 8
  return num3;
}

const genToAsync = generatorToAsync(gen);
const asyncRes = genToAsync();
console.log(asyncRes); // Promise
asyncRes.then((res) => console.log(res)); // 8

console.log("script start");

async function async1() {
  console.log("async1 start");
  await async2(); // 返回 Promise 放入事件队列 并让出主线程
  console.log("async1 end");
}

async function async2() {
  console.log("async2");
  // Promise.resolve().then(()=>{
  //   console.log("async2");
  // })
}

async1();

setTimeout(() => {
  console.log("timeout");
}, 0);

// new Promise(function (resolve) {
//   console.log("promise1");
//   resolve();
// }).then(function () {
//   console.log("promise2");
// });

console.log("script end");
