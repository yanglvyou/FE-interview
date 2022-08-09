// https://github.com/rxaviers/async-pool

const timeout = (i) =>
  new Promise((resolve) => setTimeout(() => resolve(i), i));

asyncPool(2, [1000, 5000, 3000, 2000], timeout);
// asyncPool(2, [1000, 5000, 3000, 2000], timeout).then(results => {
//   ...
// });
// Call iterator (i = 1000)
// Call iterator (i = 5000)
// Pool limit of 2 reached, wait for the quicker one to complete...
// 1000 finishes
// Call iterator (i = 3000)
// Pool limit of 2 reached, wait for the quicker one to complete...
// 3000 finishes
// Call iterator (i = 2000)
// Itaration is complete, wait until running ones complete...
// 5000 finishes
// 2000 finishes
// Resolves, results are passed in given array order `[1000, 5000, 3000, 2000]`.

function asyncPool(poolLimit, array, iteratorFn) {
  let i = 0;
  const ret = []; // 存储所有的异步任务
  const executing = []; // 存储正在执行的异步任务
  const enqueue = function () {
    if (i === array.length) {
      return Promise.resolve();
    }
    const item = array[i++]; // 获取新的任务项
    // 调用iteratorFn函数创建异步任务
    const p = Promise.resolve().then(() => iteratorFn(item, array));
    ret.push(p);

    let r = Promise.resolve();
    // 当poolLimit值小于或等于总任务个数时，进行并发控制
    if (poolLimit <= array.length) {
      // 当任务完成后，从正在执行的任务数组中移除已完成的任务
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= poolLimit) {
        r = Promise.race(executing);
      }
    }
    // 正在执行任务列表 中较快的任务执行完成之后，才会从array数组中获取新的待办任务
    return r.then(() => enqueue());
  };
  return enqueue().then(() => Promise.all(ret));
}



// const timeout = i => new Promise(resolve => setTimeout(() => resolve(i), i));
// return asyncPool(2, [1000, 5000, 3000, 2000], timeout).then(results => {
//   ...
// });

// ES7
async function asyncPool(poolLimit, array, iteratorFn) {
  const ret = [];
  const executing = [];
  for (const item of array) {
    const p = Promise.resolve().then(() => iteratorFn(item, array));
    ret.push(p);

    if (poolLimit <= array.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= poolLimit) {
        await Promise.race(executing);
      }
    }
  }
  return Promise.all(ret);
}

// const timeout = i => new Promise(resolve => setTimeout(() => resolve(i), i));
// const results = await asyncPool(2, [1000, 5000, 3000, 2000], timeout);

// ES9
async function* asyncPool(concurrency, iterable, iteratorFn) {
  const executing = new Set();
  for (const item of iterable) {
    const promise = Promise.resolve().then(() => iteratorFn(item, iterable));
    executing.add(promise);
    const clean = () => executing.delete(promise);
    promise.then(clean).catch(clean);
    if (executing.size >= concurrency) {
      yield await Promise.race(executing);
    }
  }
  while (executing.size) {
    yield await Promise.race(executing);
  }
}

/**
 * https://juejin.cn/post/6844904055819468808#heading-5
 */
async sendRequest(forms, max=4) {
  +  return new Promise(resolve => {
  +    const len = forms.length;
  +    let idx = 0;
  +    let counter = 0;
  +    const start = async ()=> {
  +      // 有请求，有通道
  +      while (idx < len && max > 0) {
  +        max--; // 占用通道
  +        console.log(idx, "start");
  +        const form = forms[idx].form;
  +        const index = forms[idx].index;
  +        idx++
  +        request({
  +          url: '/upload',
  +          data: form,
  +          onProgress: this.createProgresshandler(this.chunks[index]),
  +          requestList: this.requestList
  +        }).then(() => {
  +          max++; // 释放通道
  +          counter++;
  +          if (counter === len) {
  +            resolve();
  +          } else {
  +            start();
  +          }
  +        });
  +      }
  +    }
  +    start();
  +  });
  +}
  
