Promise.race = function (promises) {
  promises = Array.from(promises); //将可迭代对象转换为数组
  return new Promise((resolve, reject) => {
    if (promises.length === 0) {
      return;
    } else {
      for (let i = 0; i < promises.length; i++) {
        Promise.resolve(promises[i]).then(
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
    }
  });
};

Promise.race = function (promises) {
  promises = Array.from(promises);
  return new Promise((resolve, reject) => {
    if (promises.length === 0) return;
    for (let i = 0; i < promises.length; i++) {
      Promise.resolve(promises[i]).then(
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
