// https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame
// https://juejin.cn/post/7029252274299879454


function RAFSetTimeout(callback, time) {
  const startTime = Date.now();
  function loop() {
    const endTime = Date.now();
    if (endTime - startTime >= time) {
      callback();
      return;
    }
    window.requestAnimationFrame(loop);
  }

  window.requestAnimationFrame(loop);
}


setTimeout(() => {
  console.log("setTimeout");
}, 2000);
RAFSetTimeout(() => {
  console.log("RAFSetTimeout");
}, 2000);




function mySetInterval(callback, interval) {
  let rAFID = null;
  let startTime = Date.now();

  function loop() {
    let endTime = Date.now();
    if (endTime - startTime >= interval) {
      startTime = Date.now();
      callback();
    }
    rAFID = window.requestAnimationFrame(loop);
  }

  rAFID = window.requestAnimationFrame(loop);
  return rAFID;
}

setInterval(() => {
  console.log("setInterval");
}, 2000);

mySetInterval(() => {
  console.log("mySetInterval");
}, 2000);



