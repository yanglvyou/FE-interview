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
