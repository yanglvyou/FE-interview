// 实现一个带并发限制的异步调度器 Scheduler，
// 保证同时运行的任务最多有两个。完善下面代码中的 Scheduler 类，使得以下程序能正确输出。
class Scheduler {
    add(promiseCreator) { ... }
    // ...
  }
  
  const timeout = (time) => new Promise(resolve => {
    setTimeout(resolve, time)
  })
  
  const scheduler = new Scheduler()
  const addTask = (time, order) => {
    scheduler.add(() => timeout(time)).then(() => console.log(order))
  }
  
  addTask(1000, '1')
  addTask(500, '2')
  addTask(300, '3')
  addTask(400, '4')
  
  // 打印顺序是：2 3 1 4

  // output: 2 3 1 4

// 一开始，1、2两个任务进入队列
// 500ms时，2完成，输出2，任务3进队
// 800ms时，3完成，输出3，任务4进队
// 1000ms时，1完成，输出1
// 1200ms时，4完成，输出4




  class Scheduler {
    constructor() {
      this.promises = [];
      this.doingJobs = 0;
    }
  
    add(promiseCreater) {
      return new Promise((resolve, reject) => {
        // 关键是给传过来的函数加个回调属性，当resolved的时候，就能返回对应的结果了。
        promiseCreater.resolve = resolve;
        promiseCreater.reject = reject;
  
        this.promises.push(promiseCreater);
        this.run();
      });
    }
  
    run() {
      if (this.doingJobs < 2 && this.promises.length) {
        this.doingJobs += 1;
        const promise = this.promises.shift();
  
        promise().then((res) => {
          promise.resolve(res);
        })
          .catch((err) => {
            promise.reject(err);
          })
          .finally(() => {
            this.doingJobs -= 1;
            this.run();
          });
      }
    }
  }


  class Scheduler {
    constructor(count) {
      this.count = count;
      this.queue = []
      this.run = []
    }
  
    add(task) {
      this.queue.push(task)
      return this.schedule()
    }
  
    schedule() {
      if (this.run.length < this.count && this.queue.length) {
          const task = this.queue.shift()
          const promise = task().then(() => {
            this.run.splice(this.run.indexOf(promise), 1)
          })
          this.run.push(promise)
          return promise
      } else {
          return Promise.race(this.run).then(() => this.schedule())
      }
    }
  }
  
  