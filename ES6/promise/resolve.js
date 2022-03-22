// https://juejin.cn/post/6844903796129136654
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
      queueMicrotask(() => {
        param.then(resolve, reject);
      });
    } else {
      resolve(param);
    }
  });
};

Promise.resolve = function (param) {
  if (param instanceof Promise) return param;

  return new Promise((resolve, reject) => {
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
};

let p = Promise.resolve(20);
p.then((data) => {
  console.log(data);
});

let p2 = Promise.resolve({
  then: function (resolve, reject) {
    resolve(30);
  },
});

p2.then((data) => {
  console.log(data);
});

let p3 = Promise.resolve(
  new Promise((resolve, reject) => {
    resolve(400);
  })
);
p3.then((data) => {
  console.log(data);
});
