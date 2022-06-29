// https://dushusir.com/js-event-bus/
class EventBus {
  constructor() {
    // 初始化事件列表
    this.events = Object.create(null);
    // 回调函数的id
    this.callbackId = 0;
  }
  // 订阅事件
  subscribe(eventName, callback) {
    if (!this.events[eventName]) {
      // 使用对象存储，注销回调函数的时候提高删除的效率
      this.events[eventName] = Object.create(null);
    }
    // callbackId 自增
    const callbackId = this.callbackId++;

    this.events[eventName][callbackId] = callback;
    // 取消订阅
    const unSubscribe = () => {
      // 清除这个订阅者的回调函数
      delete this.events[eventName][callbackId];
      // 如果这个事件没有订阅者了，也把整个事件对象清除
      if (Object.keys(this.events[eventName]).length === 0) {
        delete this.events[eventName];
      }
    };
    return { unSubscribe };
  }

  // 只订阅一次事件
  subscribeOnce(eventName, callback) {
    if (!this.events[eventName]) {
      // 使用对象存储，注销回调函数的时候提高删除的效率
      this.events[eventName] = Object.create(null);
    }

    const callbackId = "once" + this.callbackId++;
    this.events[eventName][callbackId] = callback;

    // 取消订阅
    const unSubscribe = () => {
      // 清除这个订阅者的回调函数
      delete this.events[eventName][callbackId];
      // 如果这个事件没有订阅者了，也把整个事件对象清除
      if (Object.keys(this.events[eventName]).length === 0) {
        delete this.events[eventName];
      }
    };
    return { unSubscribe };
  }

  // 发布事件
  emit(eventName, ...args) {
    if (!this.events[eventName]) {
      console.warn(eventName + " not found!");
    }

    const callbackObj = this.events[eventName];
    // 执行每一个回调函数
    for (const callbackID in this.events[eventName]) {
      callbackObj[callbackID].apply(this, args);
      if (callbackID.includes("once")) {
        delete this.events[eventName][callbackID];
      }
    }
  }

  // 清除事件
  clear(eventName) {
    // 未提供eventName，清除所有
    if (!eventName) {
      this.events = Object.create(null);
      return;
    }
    // 清除指定事件
    delete this.events[eventName];
  }
}

const eventBus = new EventBus();

eventBus.subscribe("eventX", function (args) {
  console.log("eventX a", args, this);
});
const subscribeB = eventBus.subscribeOnce("eventX", (args) => {
  console.log("eventX b", args, this);
});
eventBus.subscribe("eventX", (args) => {
  console.log("eventX c", args, this);
});

eventBus.emit("eventX", 1000);

// 单例模式
class EventBusTool {
  static eventBus = null;
  constructor() {
    if (EventBusTool.eventBus) {
      return EventBusTool.eventBus;
    }
    return (EventBusTool.eventBus = new EventBus());
  }

  static getEventBusInstance() {
    if (EventBusTool.eventBus) {
      return EventBusTool.eventBus;
    }
    return (EventBusTool.eventBus = new EventBus());
  }
}

// https://github.com/ConardLi/awesome-coding-js/blob/master/JavaScript/EventEmitter.md
function EventEmitter() {
  this._maxListeners = 10;
  this._events = Object.create(null);
}

// 向事件队列添加事件
// prepend为true表示向事件队列头部添加事件
EventEmitter.prototype.addListener = function (type, listener, prepend) {
  if (!this._events) {
    this._events = Object.create(null);
  }
  if (this._events[type]) {
    if (prepend) {
      this._events[type].unshift(listener);
    } else {
      this._events[type].push(listener);
    }
  } else {
    this._events[type] = [listener];
  }
};

// 移除某个事件
EventEmitter.prototype.removeListener = function (type, listener) {
  if (Array.isArray(this._events[type])) {
    if (!listener) {
      delete this._events[type];
    } else {
      this._events[type] = this._events[type].filter(
        (e) => e !== listener && e.origin !== listener
      );
    }
  }
};

// 向事件队列添加事件，只执行一次
EventEmitter.prototype.once = function (type, listener) {
  const only = (...args) => {
    listener.apply(this, args);
    this.removeListener(type, listener);
  };
  only.origin = listener;
  this.addListener(type, only);
};

// 执行某类事件
EventEmitter.prototype.emit = function (type, ...args) {
  if (Array.isArray(this._events[type])) {
    this._events[type].forEach((fn) => {
      fn.apply(this, args);
    });
  }
};

// 设置最大事件监听个数
EventEmitter.prototype.setMaxListeners = function (count) {
  this.maxListeners = count;
};

var emitter = new EventEmitter();

var onceListener = function (args) {
  console.log("我只能被执行一次", args, this);
};

var listener = function (args) {
  console.log("我是一个listener", args, this);
};

emitter.once("click", onceListener);
emitter.addListener("click", listener);

emitter.emit("click", "参数");
emitter.emit("click");

emitter.removeListener("click", listener);
emitter.emit("click");
