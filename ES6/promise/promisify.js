/**
 * promisify是node的utils模块中的一个函数，它作用就是为了转换最后一个参数是回调函数的函数为promise函数，
 * 且回调函数中有两个参数：error 和 data
 */

// https://juejin.cn/post/6844903912474935303

// 使用前
fs.readFile("./index.js", (err, data) => {
  if (!err) {
    console.log(data.toString());
  }
  console.log(err);
});
// 使用promisify后
const readFile = promisify(fs.readFile);
readFile("./index.js")
  .then((data) => {
    console.log(data.toString());
  })
  .catch((err) => {
    console.log("error:", err);
  });

// const newFn = promisify(fn)
// newFn(a) 会执行Promise参数方法
function promisify(fn) {
  return function (...args) {
    // 返回promise的实例
    return new Promise(function (resolve, reject) {
      // newFn(a) 时会执行到这里向下执行
      // 加入参数cb => newFn(a)
      args.push(function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
      // 这里才是函数真正执行的地方执行newFn(a, cb)
      fn.apply(null, args);
    });
  };
}

const promisify =
  (func) =>
  (...args) => {
    return new Promise((resolve, reject) => {
      func.apply(null, [...args, (...args) => resolve(args)]);
    });
  };

function foo(str1, str2, callback) {
  setTimeout(() => {
    callback(str1, str2);
  }, 1000);
}

let agent = promisify(foo);

agent("hello", "world").then((res) => {
  console.log(res);
});



function promisify(original) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      args.push((err, value) => {
        if (err) {
          reject();
        } else {
          resolve(value);
        }
      });
      // 相当于
      original.apply(this, args);
      console.log(this, "this");
      // Reflect.apply(original, this, args);
    });
  };
}
const loadImg = function (src, callback) {
  const img = document.createElement("img");
  img.src = src;
  img.style = "width: 200px;height: 280px";
  img.onload = callback(null, src); // 正常加载时，err传null
  img.onerror = callback(new Error("图片加载失败"));
  document.body.append(img);
};
const loadImgPromise = promisify(loadImg);
const load = async () => {
  try {
    const res = await loadImgPromise(
      "https://cdn.huaban.com/home/202201210156-1e92.png"
    );
    console.log(res);
  } catch (err) {
    console.log(err);
  }
};
load();
