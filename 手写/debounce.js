// https://github.com/mqyqingfeng/Blog/issues/22

// 防抖的原理就是：你尽管触发事件，但是我一定在事件触发 n 秒后才执行，
//如果你在一个事件触发的 n 秒内又触发了这个事件，那我就以新的事件的时间为准，
// n 秒后才执行，总之，就是要等你触发完事件 n 秒内不再触发事件，我才执行，真是任性呐!

//  第一版
function debounce(func, wait) {
  var timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(func, wait);
  };
}

// 第二版

function debounce(func, wait) {
  let timer;
  return function () {
    const context = this;
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(context);
    }, wait);
  };
}

// 第三版
function debounce(func, wait) {
  let timer;
  return function (...args) {
    const context = this;
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

// 第四版

// 这个时候，代码已经很是完善了，但是为了让这个函数更加完善，我们接下来思考一个新的需求。

// 这个需求就是：

// 我不希望非要等到事件停止触发后才执行，我希望立刻执行函数，然后等到停止触发 n 秒后，才可以重新触发执行。

// 想想这个需求也是很有道理的嘛，那我们加个 immediate 参数判断是否是立刻执行。

function debounce(func, wait, immediate) {
  var timeout;

  return function () {
    var context = this;
    var args = arguments;

    if (timeout) clearTimeout(timeout);
    if (immediate) {
      // 如果已经执行过，不再执行
      var callNow = !timeout;
      timeout = setTimeout(function () {
        timeout = null;
      }, wait);
      if (callNow) func.apply(context, args);
    } else {
      timeout = setTimeout(function () {
        func.apply(context, args);
      }, wait);
    }
  };
}



// 第五版

// 此时注意一点，就是 getUserAction 函数可能是有返回值的，所以我们也要返回函数的执行结果，但是当 immediate 为 false 的时候，
// 因为使用了 setTimeout ，我们将 func.apply(context, args) 的返回值赋给变量，
// 最后再 return 的时候，值将会一直是 undefined，
// 所以我们只在 immediate 为 true 的时候返回函数的执行结果。

function debounce(func, wait, immediate) {

    var timeout, result;

    return function () {
        var context = this;
        var args = arguments;

        if (timeout) clearTimeout(timeout);
        if (immediate) {
            // 如果已经执行过，不再执行
            var callNow = !timeout;
            timeout = setTimeout(function(){
                timeout = null;
            }, wait)
            if (callNow) result = func.apply(context, args)
        }
        else {
            timeout = setTimeout(function(){
                func.apply(context, args)
            }, wait);
        }
        return result;
    }
}



// 第六版

// 最后我们再思考一个小需求，我希望能取消 debounce 函数，比如说我 debounce 的时间间隔是 10 秒钟，
// immediate 为 true，这样的话，我只有等 10 秒后才能重新触发事件，现在我希望有一个按钮，
// 点击后，取消防抖，这样我再去触发，就可以又立刻执行啦，是不是很开心？

// 为了这个需求，我们写最后一版的代码：
function debounce(func, wait, immediate) {

    var timeout, result;

    var debounced = function () {
        var context = this;
        var args = arguments;

        if (timeout) clearTimeout(timeout);
        if (immediate) {
            // 如果已经执行过，不再执行
            var callNow = !timeout;
            timeout = setTimeout(function(){
                timeout = null;
            }, wait)
            if (callNow) result = func.apply(context, args)
        }
        else {
            timeout = setTimeout(function(){
                func.apply(context, args)
            }, wait);
        }
        return result;
    };

    debounced.cancel = function() {
        clearTimeout(timeout);
        timeout = null;
    };

    return debounced;
}
