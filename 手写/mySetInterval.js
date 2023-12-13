function mySetInterval(callback, timeout) {
  let timer = null;
  function interval() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback();
      interval();
    }, timeout);
  }
  interval();

  interval.cancel = () => {
    clearTimeout(timer);
  };

  return interval;
}

function newSetInterval(fuc, time) {
  function inside() {
    fuc();
    setTimeout(inside, time);
  }
  setTimeout(inside, time);
}

// 使用方法
let timer = mySetInterval(() => {
  console.log(11111);
}, 1000);

setTimeout(() => {
  // 5s 后清理
  timer.cancel();
}, 5000);
