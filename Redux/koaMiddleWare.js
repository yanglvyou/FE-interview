// https://juejin.cn/post/6890259747866411022
// https://juejin.cn/post/7012031464237694983

const middleware = [];
let mw1 = async function (ctx, next) {
  console.log("next前，第一个中间件");
  await next();
  console.log("next后，第一个中间件");
};
let mw2 = async function (ctx, next) {
  console.log("next前，第二个中间件");
  await next();
  console.log("next后，第二个中间件");
};
let mw3 = async function (ctx, next) {
  console.log("第三个中间件，没有next了");
};

function use(mw) {
  middleware.push(mw);
}

function compose(middleware) {
  return (ctx, next) => {
    return dispatch(0);
    function dispatch(i) {
      const fn = middleware[i];
      if (!fn) return  Promise.resolve();
      return fn(ctx, dispatch.bind(null, i + 1));
    }
  };
}

use(mw1);
use(mw2);
use(mw3);

const fn = compose(middleware);

fn();


/**
 * Compose `middleware` returning
 * a fully valid middleware comprised
 * of all those which are passed.
 *
 * @param {Array} middleware
 * @return {Function}
 * @api public
 */
 function compose(middleware) {
  // 省略部分代码
  return function (context, next) {
    // last called middleware #
    let index = -1;
    return dispatch(0);
    function dispatch(i) {
      if (i <= index)
        return Promise.reject(new Error("next() called multiple times"));
      index = i;
      let fn = middleware[i];
      if (i === middleware.length) fn = next;
      if (!fn) return Promise.resolve();
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    }
  };
}

