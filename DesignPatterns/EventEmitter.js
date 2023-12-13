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

function EventEmitter() {
  this.events = new Map();
}

// once 参数表示是否只是触发一次
const wrapCallback = (fn, once = false) => ({ callback: fn, once });

EventEmitter.prototype.addListener = function (type, fn, once = false) {
  let handler = this.events.get(type);
  if (!handler) {
    // 为 type 事件绑定回调
    this.events.set(type, wrapCallback(fn, once));
  } else if (handler && typeof handler.callback === "function") {
    // 目前 type 事件只有一个回调
    this.events.set(type, [handler, wrapCallback(fn, once)]);
  } else {
    // 目前 type 事件回调数 >= 2
    handler.push(wrapCallback(fn, once));
  }
};

EventEmitter.prototype.removeListener = function (type, listener) {
  let handler = this.events.get(type);
  if (!handler) return;
  if (!Array.isArray(handler)) {
    if (handler.callback === listener.callback) this.events.delete(type);
    else return;
  }
  for (let i = 0; i < handler.length; i++) {
    let item = handler[i];
    if (item.callback === listener.callback) {
      // 删除该回调，注意数组塌陷的问题，即后面的元素会往前挪一位。i 要 --
      handler.splice(i, 1);
      i--;
      if (handler.length === 1) {
        // 长度为 1 就不用数组存了
        this.events.set(type, handler[0]);
      }
    }
  }
};

EventEmitter.prototype.once = function (type, fn) {
  this.addListener(type, fn, true);
};

EventEmitter.prototype.emit = function (type, ...args) {
  let handler = this.events.get(type);
  if (!handler) return;
  if (Array.isArray(handler)) {
    // 遍历列表，执行回调
    handler.map((item) => {
      item.callback.apply(this, args);
      // 标记的 once: true 的项直接移除
      if (item.once) this.removeListener(type, item);
    });
  } else {
    // 只有一个回调则直接执行
    handler.callback.apply(this, args);
  }
  return true;
};

EventEmitter.prototype.removeAllListener = function (type) {
  let handler = this.events.get(type);
  if (!handler) return;
  else this.events.delete(type);
};

let e = new EventEmitter();
e.addListener("type", () => {
  console.log("type事件触发！");
});
e.addListener("type", () => {
  console.log("WOW!type事件又触发了！");
});

function f() {
  console.log("type事件我只触发一次");
}
e.once("type", f);
e.emit("type");
e.emit("type");
e.removeAllListener("type");
e.emit("type");

// type事件触发！
// WOW!type事件又触发了！
// type事件我只触发一次
// type事件触发！
// WOW!type事件又触发了！
