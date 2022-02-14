class Promise {
  constructor(executor) {
    // 初始化state为等待态
    this.state = "pending";
    this.value = null;
    this.reason = null;
    this.onResolvedCallbacks = []; //成功的回调
    this.onRejectedCallbacks = []; //失败的回调
    //PromiseA+ 2.1
    let resolve = (value) => {
      if (this.state === "pending") {
        this.state = "fulfilled";
        this.value = value;
        //PromiseA+ 2.2.6.1:如果/当 promise 完成执行（fulfilled）,各个相应的onFulfilled回调 必须根据最原始的then 顺序来调用
        this.onResolvedCallbacks.forEach((fn) => fn());
      }
    };
    let reject = (reason) => {
      if (this.state === "pending") {
        this.state = "rejected";
        this.reason = reason;
        //PromiseA+ 2.2.6.2:如果/当 promise 被拒绝（rejected）,各个相应的onRejected回调 必须根据最原始的then 顺序来调用
        this.onRejectedCallbacks.forEach((fn) => fn()); //但是当resolve在setTomeout内执行，then时state还是pending等待状态 我们就需要在then调用的时候，将成功和失败存到各自的数组，一旦reject或者resolve，就调用它们类似于发布订阅，先将then里面的两个函数储存起来，由于一个promise可以有多个then，所以存在同一个数组内。
      }
    };
    // 如果executor执行报错，直接执行reject
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }
  then(onFulfilled, onRejected) {
    //PromiseA+ 2.2.1 , onFulfilled和onRejected都是可选的参数： 如果 onFulfilled不是函数，必须忽略,如果 onRejected不是函数，必须忽略

    // PromiseA+ 2.2.5

    // PromiseA+ 2.2.7.3 ,如果onFulfilled不是一个方法，并且promise1已经完成（fulfilled）, promise2必须使用与promise1相同的值来完成（fulfiled）

    // PromiseA+ 2.2.7.4,如果onRejected不是一个方法，并且promise1已经被拒绝（rejected）, promise2必须使用与promise1相同的原因来拒绝（rejected）
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (value) => value;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (err) => {
            throw err;
          };
    //PromiseA+ 2.2.7, then必须返回一个promise , promise2 = promise1.then(onFulfilled, onRejected);
    let promise2 = new Promise((resolve, reject) => {
      if (this.state === "fulfilled") {
        //PromiseA+ 2.2.4 --- setTimeout,在执行上下文堆栈（execution context）仅包含平台代码之前，不得调用 onFulfilled和onRejected
        // 异步
        setTimeout(() => {
          try {
            //PromiseA+ 2.2.7.1,onFulfilled或onRejected返回一个值x, 运行 Promise Resolution Procedure [[Resolve]](promise2, x)
            let x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      }
      if (this.state === "rejected") {
        // 异步
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      }
      if (this.state === "pending") {
        this.onResolvedCallbacks.push(() => {
          // 异步
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
      }
    });
    // 返回promise，完成链式
    return promise2;
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  //如果 x === promise2，则是会造成循环引用，自己等待自己完成，则报“循环引用”错误
  // let p = new Promise(resolve => {
  //     resolve(0);
  //   });
  //   var p2 = p.then(data => {
  //     // 循环引用，自己等待自己完成，一辈子完不成
  //     return p2;
  //   })
  if (x === promise2) {
    return reject(new TypeError("Chaining cycle detected for promise"));
  }
  let called; //PromiseA+2.3.3.3.3 只能调用一次,如果resolvePromise和 rejectPromise都被调用，或者对同一个参数进行多次调用，第一次调用执行，任何进一步的调用都被忽略
  if (x !== null && (typeof x === "object" || typeof x === "function")) {
    // x 是对象或者函数（包括promise）， let then = x.then 2、当x是对象或者函数（默认promise）
    try {
      let then = x.then;
      if (typeof then === "function") {
        // 就让then执行 第一个参数是this   后面是成功的回调 和 失败的回调
        then.call(
          x,
          (y) => {
            // 成功和失败只能调用一个
            if (called) return;
            called = true;
            // resolve的结果依旧是promise 那就继续解析
            resolvePromise(promise2, y, resolve, reject);
          },
          (err) => {
            // 成功和失败只能调用一个
            if (called) return;
            called = true;
            reject(err);
          }
        );
      } else {
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      // 取then出错了那就不要在继续执行了
      reject(e);
    }
  } else {
    // x 是普通值 直接resolve(x)
    resolve(x);
  }
}

//resolve方法
Promise.resolve = function (param) {
  if (param instanceof Promise) {
    return param;
  }
  return new Promise((resolve, reject) => {
    if (
      param &&
      typeof param === "object" &&
      typeof param.then === "function"
    ) {
      setTimeout(() => {
        param.then(resolve, reject);
      });
    } else {
      resolve(param);
    }
  });
};

//reject方法
Promise.reject = function (val) {
  return new Promise((resolve, reject) => {
    reject(val);
  });
};

// finally方法,不能用箭头函数
Promise.prototype.finally = function (callback) {
  let p = this.constructor;

  return this.then(
    (value) => p.resolve(callback()).then(() => value),
    (reason) =>
      p.resolve(callback()).then(() => {
        throw reason;
      })
  );
};
//race方法
Promise.race = function (promises) {
  promises = Array.from(promises);
  return new Promise((resolve, reject) => {
    if (promises.length === 0) {
      return;
    }
    for (let i = 0; i < promises.length; i++) {
      resolve(promises[i]).then(
        (data) => {
          resolve(data);
          return;
        },
        (err) => {
          reject(err);
          return;
        }
      );
    }
  });
};
//all方法(获取所有的promise，都执行then，把结果放到数组，一起返回)
Promise.all = function (promises) {
  promises = Array.from(promises); //将可迭代对象转换为数组
  return new Promise((resolve, reject) => {
    let index = 0;
    let result = [];
    if (promises.length === 0) {
      resolve(result);
    } else {
      function processValue(i, data) {
        result[i] = data;
        if (++index === promises.length) {
          resolve(result);
        }
      }
      for (let i = 0; i < promises.length; i++) {
        //promises[i] 可能是普通值
        Promise.resolve(promises[i]).then(
          (data) => {
            processValue(i, data);
          },
          (err) => {
            reject(err);
            return;
          }
        );
      }
    }
  });
};

Promise.race([
  new MyPromise((resolve, reject) => {
    setTimeout(() => {
      resolve(100);
    }, 1000);
  }),
  new MyPromise((resolve, reject) => {
    setTimeout(() => {
      resolve(200);
    }, 200);
  }),
  new MyPromise((resolve, reject) => {
    setTimeout(() => {
      reject(100);
    }, 100);
  }),
]).then(
  (data) => {
    console.log(data);
  },
  (err) => {
    console.log(err);
  }
);

Promise.defer = Promise.deferred = function () {
  let dfd = {};
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
};
module.exports = Promise;
