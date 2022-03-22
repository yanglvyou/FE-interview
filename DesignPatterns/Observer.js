// 观察者模式 https://github.com/ConardLi/awesome-coding-js/blob/master/JavaScript/EventEmitter.md

class EventEmitter {
  constructor(maxListeners) {
    this.maxListeners = maxListeners || 10;
    this.events = Object.create(null);
  }

  // 向事件队列添加事件
  // prepend为true表示向事件队列头部添加事件
  addEventListener(type, listener, prepend) {
    if (!this.events) {
      this.events = Object.create(null);
    }

    if (this.events[type]) {
      if (prepend) {
        this.events[type].unshift(listener);
      } else {
        this.events[type].push(listener);
      }
    } else {
      this.events[type] = [listener];
    }
  }

  // 一处某个事件
  removeListener(type, listener) {
    if (Array.isArray(this.events[type])) {
      if (!listener) {
        delete this.events[type];
      } else {
        this.events[type] = this.events[type].filter((event) => {
          return event !== listener && event.origin !== listener;
        });
      }
    }
  }

  // 事件只执行一次
  once(type, listener) {
    const only = (...args) => {
      listener.apply(this, args);
      this.removeListener(type, listener);
    };
    only.origin = listener;

    this.addEventListener(type, only);
  }

  // 执行某类事件
  emit(type, ...args) {
    if (Array.isArray(this.events[type])) {
      this.events[type].forEach((fn) => {
        fn.apply(this, args);
      });
    }
  }

  // 设置最大监听数量
  setMaxListeners(num) {
    if (Object.prototype.toString.call(num) === "[object Number]") {
      this.maxListeners = num;
    }
  }
}

var emitter = new EventEmitter();

var onceListener = function (args) {
  console.log("我只能被执行一次", args, this);
};

var listener = function (args) {
  console.log("我是一个listener", args, this);
};

emitter.once("click", onceListener);
emitter.addEventListener("click", listener);

emitter.emit("click", "参数");
emitter.emit("click");

emitter.removeListener("click", listener);
emitter.emit("click");
