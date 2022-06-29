const FULFILLED = "fulfilled";
const REJECTED = "rejected";
const PENDING = "pending";

class MyPromise {
  constructor(executor) {
    this.status = PENDING;
    this.value = null;
    this.reason = null;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value;

        while (this.onFulfilledCallbacks.length) {
          this.onFulfilledCallbacks.shift()()
        }
      }
    };

    const reject = (reason) => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;

        while (this.onRejectedCallbacks.length) {
          this.onRejectedCallbacks.shift()()
        }
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      return reject(error);
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

      if (this.status === PENDING) {
        this.onFulfilledCallbacks.push(onFulfilledQueueMicrotask);
        this.onRejectedCallbacks.push(onRejectedQueueMicrotask);
      } else if (this.status === FULFILLED) {
        onFulfilledQueueMicrotask();
      } else if (this.status === REJECTED) {
        onRejectedQueueMicrotask();
      }
    });

    return promise2;
  }
}

function resolvePromise(promise, x, resolve, reject) {
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
          (err) => {
            if (called) return;
            called = true;
            reject(err);
          }
        );
      } catch (error) {
        if (called) return;
        called = true;
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
  let result = {};
  result.promise = new MyPromise((resolve, reject) => {
    result.resolve = resolve;
    result.reject = reject;
  });
  return result;
};

module.exports = MyPromise;
