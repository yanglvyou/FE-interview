// https://es6.ruanyifeng.com/#docs/promise#Promise-all


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

Promise.all = function (promises) {
  promises = Array.from(promises);
  return new Promise((resolve, reject) => {
    let index = 0;
    const result = [];
    if (promises.length === 0) return resolve(result);
    for (let i = 0; i < promises.length; i++) {
      Promise.resolve(promises[i]).then(
        (data) => {
          result[i] = data;
          if (++index === promises.length) return resolve(result);
        },
        (err) => {
          reject(err);
          return;
        }
      );
    }
  });
};

function all(iterable) {
  // 获取迭代器，因为入参类型是iterable，就要用迭代器去做迭代了
  let iterator = iterable[Symbol.iterator]();
  return new Promise((resolve, reject) => {
    let arr = []; // 记录返回值
    let count = 0; // 计数器
    while (true) {
      //
      let { done, value } = iterator.next();
      if (done) {
        // 迭代结束
        break;
      }
      let i = count++; // 计数器自增，记录当前index
      value
        .then((res) => {
          // 保存结果
          arr[i] = res;
          /**
           * 计数器自减，如果为0则执行resolve
           * 由于对arr[i]赋值后，length就不会小于i+1,所以不能直接用length判断
           */
          if (!--count) {
            resolve(arr);
          }
        })
        .catch((err) => {
          // 如果有错误则执行reject
          reject(err);
        });
    }
  });
}
