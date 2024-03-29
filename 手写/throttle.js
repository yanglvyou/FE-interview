// https://github.com/mqyqingfeng/Blog/issues/26
/**
 * 节流的原理很简单：

如果你持续触发事件，每隔一段时间，只执行一次事件。

根据首次是否执行以及结束后是否执行，效果有所不同，实现的方式也有所不同。
我们用 leading 代表首次是否执行，trailing 代表结束后是否再执行一次。

 */

/**
 *
 * 使用时间戳
 * 让我们来看第一种方法：使用时间戳，当触发事件的时候，我们取出当前的时间戳，然后减去之前的时间戳(最一开始值设为 0 )，
 * 如果大于设置的时间周期，就执行函数，然后更新时间戳为当前的时间戳，如果小于，就不执行。
 */

function throttle(func, wait) {
  var context, args;
  var previous = 0;

  return function () {
    var now = +new Date();
    context = this;
    args = arguments;
    if (now - previous > wait) {
      func.apply(context, args);
      previous = now;
    }
  };
}

/**
 * 使用定时器,
 * 当触发事件的时候，我们设置一个定时器，再触发事件的时候，如果定时器存在，
 * 就不执行，直到定时器执行，然后执行函数，清空定时器，这样就可以设置下个定时器。
 */

// 第二版
function throttle(func, wait) {
  var timeout;
  return function () {
    const context = this;
    args = arguments;
    if (!timeout) {
      timeout = setTimeout(function () {
        timeout = null;
        func.apply(context, args);
      }, wait);
    }
  };
}

/**
 * 双剑合璧
 * 有人就说了：我想要一个有头有尾的！就是鼠标移入能立刻执行，停止触发的时候还能再执行一次！
 */

// 第三版
function throttle(func, wait) {
  var timeout, context, args;
  var previous = 0;

  var later = function () {
    previous = +new Date();
    timeout = null;
    func.apply(context, args);
  };

  var throttled = function () {
    var now = +new Date();
    //下次触发 func 剩余的时间
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    // 如果没有剩余的时间了或者你改了系统时间
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(context, args);
    } else if (!timeout) {
      timeout = setTimeout(later, remaining);
    }
  };
  return throttled;
}

function throttle3(fn, wait) {
  let context,
    timeout = null,
    previous = 0;

  return function (...args) {
    context = this;
    const now = +new Date();
    const remaining = wait - (now - previous);
    const later = function () {
      timeout = null;
      previous = +new Date();
      fn.apply(context, args);
    };
    if (remaining <= 0) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      fn.apply(context, args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null;
        previous = +new Date();
        fn.apply(context, args);
      }, wait);
    }
  };
}

// function throttle3(fn, wait) {
//   let context,
//     timeout,
//     previous = 0;

//   const later = function () {
//     previous = +new Date();
//     timeout = null;
//     fn.apply(context);
//   };

//   return function (...args) {
//     context = this;
//     const now = +new Date();
//     // 下次触发的时间
//     const remaining = wait - (now - previous);

//     if (remaining <= 0) {
//       if (timeout) {
//         clearTimeout(timeout);
//         timeout = null;
//       }
//       previous = now;
//       fn.apply(context, args);
//     } else if (!timeout) {
//       timeout = setTimeout(later, remaining);
//     }
//   };
// }

// 第四版
/**
 * 但是我有时也希望无头有尾，或者有头无尾，这个咋办？

那我们设置个 options 作为第三个参数，然后根据传的值判断到底哪种效果，我们约定:

leading：false 表示禁用第一次执行
trailing: false 表示禁用停止触发的回调
 * @param {*} func 
 * @param {*} wait 
 * @param {*} options 
 * @returns 
 */
function throttle(func, wait, options) {
  var timeout, context, args, result;
  var previous = 0;
  if (!options) options = {};

  var later = function () {
    previous = options.leading === false ? 0 : new Date().getTime();
    timeout = null;
    func.apply(context, args);
    if (!timeout) context = args = null;
  };

  var throttled = function () {
    var now = new Date().getTime();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
  };
  return throttled;
}
