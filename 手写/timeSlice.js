const listDom = document.getElementById("app");
/**
 * https://segmentfault.com/a/1190000040851156
 * @param {*} gen
 * @returns
 */

//首先我们封装一个时间切片执行器
function timeSlice(gen) {
  if (typeof gen !== "function")
    throw new Error("TypeError: the param expect a generator function");
  var g = gen();
  if (!g || typeof g.next !== "function") return;
  return function next() {
    var start = performance.now();

    var res = null;
    do {
      res = g.next();
    } while (res.done !== true && performance.now() - start < 25);
    if (res.done) return;
    window.requestIdleCallback(next);
  };
}
//然后把长任务变成generator函数，交由时间切片执行器来控制执行
const add = function (i) {
  let item = document.createElement("li");
  item.innerText = `第${i++}条`;
  listDom.appendChild(item);
};
function* gen() {
  let i = 0;
  while (i < 10000) {
    yield add(i);
    i++;
  }
}
//使用时间切片来插入10W条数据
function bigInsert() {
  timeSlice(gen)();
}

bigInsert();

/**
 * https://juejin.cn/post/6943896410987659277
 */

let taskQueue = [
  () => {
    console.log("task1 start");
    console.log("task1 end");
  },
  () => {
    console.log("task2 start");
    console.log("task2 end");
  },
  () => {
    console.log("task3 start");
    console.log("task3 end");
  },
];

const performUnitWork = () => {
  // 取出第一个队列中的第一个任务并执行
  taskQueue.shift()();
};

const workloop = (deadline) => {
  console.log(`此帧的剩余时间为: ${deadline.timeRemaining()}`);
  // 如果此帧剩余时间大于0或者已经到了定义的超时时间（上文定义了timeout时间为1000，到达时间时必须强制执行），且当时存在任务，则直接执行这个任务
  // 如果没有剩余时间，则应该放弃执行任务控制权，把执行权交还给浏览器
  while (
    (deadline.timeRemaining() > 0 || deadline.didTimeout) &&
    taskQueue.length > 0
  ) {
    performUnitWork();
  }

  // 如果还有未完成的任务，继续调用requestIdleCallback申请下一个时间片
  if (taskQueue.length > 0) {
    window.requestIdleCallback(workloop, { timeout: 1000 });
  }
};

requestIdleCallback(workloop, { timeout: 1000 });
