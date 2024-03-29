// https://juejin.cn/post/6844903986479251464#heading-26
Array.prototype.reduce = function (callbackfn, initialValue) {
  // 异常处理，和 map 一样
  // 处理数组类型异常
  if (this === null || this === undefined) {
    throw new TypeError("Cannot read property 'reduce' of null or undefined");
  }
  // 处理回调类型异常
  if (Object.prototype.toString.call(callbackfn) != "[object Function]") {
    throw new TypeError(callbackfn + " is not a function");
  }
  let O = Object(this);
  let len = O.length >>> 0;
  let k = 0;
  let accumulator = initialValue;
  if (accumulator === undefined) {
    for (; k < len; k++) {
      // 查找原型链
      if (k in O) {
        accumulator = O[k];
        k++;
        break;
      }
    }
  }
  // 表示数组全为空
  if (k === len && accumulator === undefined)
    throw new Error("Each element of the array is empty");
  for (; k < len; k++) {
    if (k in O) {
      // 注意，核心！
      accumulator = callbackfn.call(undefined, accumulator, O[k], k, O);
    }
  }
  return accumulator;
};

// 使用 reduce实现map
if (!Array.prototype.mapUsingReduce) {
  Array.prototype.mapUsingReduce = function (callback, thisArg) {
    return this.reduce(function (mappedArray, currentValue, index, array) {
      mappedArray[index] = callback.call(thisArg, currentValue, index, array);
      return mappedArray;
    }, []);
  };
}

[1, 2, , 3].mapUsingReduce(
  (currentValue, index, array) => currentValue + index + array.length
); // [5, 7, , 10]

/**
 * 链接一系列 Promise 处理程序。
 *
 * @param {array} arr——一个 Promise 处理程序列表，每个处理程序接收前一个处理程序解决的结果并返回另一个 Promise。
 * @param {*} input——开始调用 Promise 链的初始值
 * @return {Object}——由一系列 Promise 链接而成的 Promise
 */
function runPromiseInSequence(arr, input) {
  return arr.reduce(
    (promiseChain, currentFunction) => promiseChain.then(currentFunction),
    Promise.resolve(input)
  );
}

// Promise 函数 1
function p1(a) {
  return new Promise((resolve, reject) => {
    resolve(a * 5);
  });
}

// Promise 函数 2
function p2(a) {
  return new Promise((resolve, reject) => {
    resolve(a * 2);
  });
}

// 函数 3——将由 `.then()` 包装在已解决的 Promise 中
function f3(a) {
  return a * 3;
}

// Promise 函数 4
function p4(a) {
  return new Promise((resolve, reject) => {
    resolve(a * 4);
  });
}

const promiseArr = [p1, p2, f3, p4];
runPromiseInSequence(promiseArr, 10).then(console.log); // 1200
