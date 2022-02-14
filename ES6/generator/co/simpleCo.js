
// https://github.com/tj/co


// function simpleCo(gen) {
//   const ctx = this;
//   const args = Array.prototype.slice.call(arguments, 1);

//   return new Promise((resolve, reject) => {
//     if (typeof gen === "function") gen = gen.apply(ctx, args);
//     if (!gen || typeof gen.next !== "function") return resolve(gen);

//     onFulfilled();

//     function onFulfilled(res) {
//       let ret;
//       try {
//         ret = gen.next(res);
//       } catch (error) {
//         return reject(error);
//       }
//       next(ret);
//     }

//     function onRejected(err) {
//       let ret;
//       try {
//         ret = gen.throw(err);
//       } catch (error) {
//         return reject(error);
//       }
//       next(ret);
//     }

//     function next(ret) {
//       if (ret.done) return resolve(ret.value);
//       const value = ret.value;
//       if (value && typeof value.then === "function")
//         return value.then(onFulfilled, onRejected);

//       return onRejected(new TypeError("出错了"));
//     }
//   });
// }

simpleCo.wrap = function (fn) {
  return function createPromise() {
    return simpleCo.call(this, fn.apply(this, arguments));
  };
};

function simpleCo(gen) {
  const ctx = this;
  const args = Array.prototype.slice.call(arguments, 1);

  return new Promise((resolve, reject) => {
    // gen 是一个函数，就调用它创建一个迭代器对象
    if (typeof gen === "function") gen = gen.apply(ctx, args);

    if (!gen || typeof gen.next !== "function") return resolve(gen);

    onFulfilled();
    /**
     * @param {Mixed} res
     * @return {Promise}
     * @api private
     *
     * 第一次调用时, res 的值为 undefined
     * 后面每次迭代都接受 promise resolve 的结果
     */

    function onFulfilled(res) {
      let ret;
      try {
        /**
         * 迭代器对象调用 next() 获取 yield 后每次迭代的值
         * 调用 next() 方法时, 如果传入了 res, 这个参数会传给上一条执行 yield 语句左边的变量
         */
        ret = gen.next(res);
      } catch (error) {
        return reject(error);
      }
      /**
       * ret => {value: any, done: boolean}
       * 在 next 函数中根据 done 值判断迭代器是否结束。如果没有结束，则尝试将 value 转成 promise
       * 核心代码是 toPromise 这个函数
       */
      next(ret);
    }

    function onRejected(err) {
      let ret;
      try {
        ret = gen.throw(err);
      } catch (error) {
        return reject(error);
      }
      next(ret);
    }

    function next(ret) {
      if (ret.done) return resolve(ret.value);
      const value = ret.value;

      if (value && typeof value.then === "function") {
        return value.then(onFulfilled, onRejected);
      }

      return onRejected(new TypeError());
    }
  });
}
