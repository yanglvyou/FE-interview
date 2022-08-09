// https://juejin.cn/post/6883706752487915534

const sleep = (time) =>
  new Promise((resolve) => {
    setTimeout(resolve, time);
  });

class Lazy {
  constructor(name) {
    this.enqueue = [() => console.log(name)];
    setTimeout(this.run.bind(this), 0);
  }

  async run() {
    while (this.enqueue.length) {
      await this.enqueue.shift()();
    }
  }
  eat(name) {
    this.enqueue.push(() => console.log(name));
    return this;
  }

  sleep(time) {
    this.enqueue.push(() => sleep(time));
    return this;
  }
  sleepFirst(time) {
    this.enqueue.unshift(() => sleep(time));
    return this;
  }
}

const LazyMan = (name) => new Lazy(name);

LazyMan("LazyMan1").sleepFirst(9000).eat("food").sleep(3000).eat("dinner");

class _LazyMan1 {
  constructor(name) {
    this.enqueue = [];
    this.sayName(name);
    setTimeout(() => {
      this.next();
    });
  }

  sayName(name) {
    const fn = () => {
      console.log(`Hi! This is ${name}`);
      this.next();
    };
    this.enqueue.push(fn);
  }
  next() {
    const fn = this.enqueue.shift();
    fn && fn();
  }

  holdOn(time) {
    return () => {
      setTimeout(() => {
        console.log(`Wake up after ${time}`);
        this.next();
      }, time * 1000);
    };
  }

  sleep(time) {
    this.enqueue.push(this.holdOn(time));
    return this;
  }

  sleepFirst(time) {
    this.enqueue.unshift(this.holdOn(time));
    return this;
  }

  eat(something) {
    const fn = () => {
      console.log(`Eat ${something}~`);
      this.next();
    };
    this.enqueue.push(fn);
    return this;
  }
}

class _LazyMan2 {
  constructor(name) {
    this.name = name;
    this.sayName = this.sayName.bind(this);
    this.queue = [this.sayName];
    setTimeout(async () => {
      for (let todo of this.queue) {
        await todo();
      }
    }, 0);
  }

  //   callByOrder(queue) {
  //     let sequence = Promise.resolve();
  //     this.queue.forEach((item) => {
  //       sequence = sequence.then(item);
  //     });
  //   }

  sayName() {
    return new Promise((resolve) => {
      console.log(`Hi! this is ${this.name}!`);
      resolve();
    });
  }

  holdOn(time) {
    return () =>
      new Promise((resolve) => {
        setTimeout(() => {
          console.log(`Wake up after ${time} second`);
          resolve();
        }, time * 1000);
      });
  }

  sleep(time) {
    this.queue.push(this.holdOn(time));
    return this;
  }

  eat(meal) {
    this.queue.push(() => {
      console.log(`eat ${meal}`);
    });
    return this;
  }

  sleepFirst(time) {
    this.queue.unshift(this.holdOn(time));
    return this;
  }
}
// https://github.com/BetaSu/fe-hunter/issues/13#issuecomment-1077839583
function LazyMan(name) {
  const { log } = console;
  const sleep = (s) =>
    new Promise((res) =>
      setTimeout(() => log(`Wake up after ${s}`) || res(), s * 1000)
    );
  // 定义队列并切设置第一个任务
  const queue = [() => log(`Hi! This is ${name}!`)];

  // 这个里用了 push(x) && ctx
  // push 的返回值是数组 push 后的长度 所以不会出现 0 , 可以放心在箭头函数里使用
  const ctx = {
    eat: (food) => queue.push(() => log(`Eat ${food}~`)) && ctx,
    sleep: (s) => queue.push(() => sleep(s)) && ctx,
    sleepFirst: (s) => queue.unshift(() => sleep(s)) && ctx,
  };

  // 延迟在下一个周期执行, 为了收集执行的任务
  queueMicrotask(async () => {
    while (queue.length) {
      await queue.shift()();
    }
  });
  return ctx;
}

const LazyMan = (name) => new _LazyMan(name);

// LazyMan("Hank");
// 输出:
// Hi! This is Hank!

// LazyMan("Hank").sleep(3).eat("dinner");
// 输出:
// Hi! This is Hank!
// //等待3秒..
// Wake up after 3
// Eat dinner~

// LazyMan("Hank").eat("dinner").eat("supper");
// 输出:
// Hi This is Hank!
// Eat dinner~
// Eat supper~

LazyMan("Hank").sleepFirst(2).eat("dinner").sleep(3).eat("supper");
// 输出:
// //等待2秒..
// Wake up after 2
// Hi This is Hank!
// Eat dinner~
// //等待3秒..
// Wake up after 2
// Eat supper~

// 以此类推
