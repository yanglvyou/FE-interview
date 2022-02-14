const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class MyPromise {
  constructor(executor) {
    this.status = PENDING;
    this.value = null;
    this.reason = null;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    let resolve = (value) => {
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value;
        while (this.onFulfilledCallbacks.length > 0) {
          this.onFulfilledCallbacks.shift()(value);
        }
      }
    };

    let reject = (reason) => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;
        while (this.onRejectedCallbacks.length) {
          this.onRejectedCallbacks.shift()(reason);
        }
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (value) => value;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };

    const promise2 = new MyPromise((resolve, reject) => {
      const onFulfilledQueueMicrotask = () => {
        queueMicrotask(() => {
          try {
            const x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      };

      const onRejectedQueueMicrotask = () => {
        queueMicrotask(() => {
          try {
            const x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      };

      if (this.status === FULFILLED) {
        onFulfilledQueueMicrotask();
      } else if (this.status === REJECTED) {
        onRejectedQueueMicrotask();
      } else if (this.status === PENDING) {
        this.onFulfilledCallbacks.push(onFulfilledQueueMicrotask);
        this.onRejectedCallbacks.push(onRejectedQueueMicrotask);
      }
    });

    return promise2;
  }

  // reject 静态方法
  static reject(reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    });
  }

  // resolve 静态方法

  static resolve(param) {
    if (param instanceof MyPromise) return param;
    return new MyPromise((resolve, reject) => {
      if (
        param &&
        typeof param === "object" &&
        typeof param.then === "function"
      ) {
        queueMicrotask(() => {
          param.then(resolve, reject);
        });
      } else {
        resolve(param);
      }
    });
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  finally(callback) {
    return this.then(
      (value) => MyPromise.resolve(callback().then(() => value)),
      (err) =>
        MyPromise.resolve(callback()).then(() => {
          throw err;
        })
    );
  }

  // Promise.all 静态方法
  static all(promises) {
    promises = Array.from(promises);
    return new MyPromise((resolve, reject) => {
      const result = [];
      let index = 0;
      if (promises.length === 0) return resolve(result);

      for (let i = 0; i < promises.length; i++) {
        MyPromise.resolve(promises[i]).then(
          (data) => {
            result[i] = data;
            if (++index === promises.length) {
              return resolve(result);
            }
          },
          (err) => {
            reject(err);
            return;
          }
        );
      }
    });
  }
}

function resolvePromise(promise, x, resolve, reject) {
  // const promise = new Promise((resolve, reject) => {
  //     resolve(100)
  //   })
  //   const p1 = promise.then(value => {
  //     console.log(value)
  //     return p1
  //   })

  if (promise === x) {
    return reject(new TypeError("循环引用"));
  }

  if (x !== null && (typeof x === "object" || typeof x === "function")) {
    let then;
    try {
      then = x.then;
    } catch (error) {
      reject(error);
    }

    if (typeof then === "function") {
      let called = false;
      try {
        then.call(
          x,
          (y) => {
            if (called) return;
            called = true;
            resolvePromise(promise, y, resolve, reject);
          },
          (r) => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } catch (error) {
        if (called) return;
        reject(error);
      }
    } else {
      resolve(x);
    }
  } else {
    resolve(x);
  }
}

MyPromise.deferred = function () {
  var result = {};
  result.promise = new MyPromise(function (resolve, reject) {
    result.resolve = resolve;
    result.reject = reject;
  });

  return result;
};

module.exports = MyPromise;
