// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled
// https://es6.ruanyifeng.com/#docs/promise#Promise-allSettled
if (!Promise.allSettled) {
  Promise.allSettled = function (promises) {
    return new Promise((resolve) => {
      const data = [],
        len = promises.length;
      let count = len;
      for (let i = 0; i < len; i += 1) {
        const promise = promises[i];
        Promise.resolve(promise)
          .then(
            (res) => {
              data[i] = { status: "fulfilled", value: res };
            },
            (error) => {
              data[i] = { status: "rejected", reason: error };
            }
          )
          .finally(() => {
            // promise has been settled
            if (!--count) {
              resolve(data);
            }
          });
      }
    });
  };
}

if (!Promise.allSettled) {
  Promise.allSettled = function (promises) {
    return Promise.all(
      promises.map((p) =>
        Promise.resolve(p).then(
          (res) => {
            return { status: "fulfilled", value: res };
          },
          (error) => {
            return { status: "rejected", reason: error };
          }
        )
      )
    );
  };
}

Promise.allSettled = function (promises) {
  return Promise.all(
    promises.map((p) =>
      Promise.resolve(p).then(
        (res) => {
          return { status: "fulfilled", value: res };
        },
        (err) => {
          return { status: "rejected", reason: err };
        }
      )
    )
  );
};

Promise.allSettled = function (promises) {
  promises = Array.from(promises);
  return new Promise((resolve) => {
    const result = [];
    let index = 0;
    if (promises.length === 0) return resolve(result);
    for (let i = 0; i < promises.length; i++) {
      Promise.resolve(promises[i])
        .then(
          (res) => {
            result[i] = { status: "fulfilled", value: res };
          },
          (err) => {
            result[i] = { status: "rejected", reason: err };
          }
        )
        .finally(() => {
          if (++index === promises.length) {
            resolve(result);
          }
        });
    }
  });
};
