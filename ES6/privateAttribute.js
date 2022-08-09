/**
 * 私有方法和私有属性，是只能在类的内部访问的方法和属性，
 * 外部不能访问。这是常见需求，有利于代码的封装
 * https://juejin.cn/post/7080131411503972366
 */

/**
 * _prop
 * 区分私有和公有最简单的方式就是加个下划线 _，从命名上来区分。
 * 但是这种方式只是一种命名规范，
 * 告诉开发者这个属性、方法是私有的，不要调用，但终究不是强制的，如果别人要用也阻止不了。
 */

class Dong {
  constructor() {
    this._name = "dong";
    this._age = 20;
    this.friend = "guang";
  }

  hello() {
    return "I'm " + this._name + ", " + this._age + " years old";
  }
}

const dong = new Dong();

console.log(dong.hello());

/**
 * Proxy
 * Proxy 可以定义目标对象的 get、set、Object.keys 的逻辑，可以在这一层做一下判断，
 * 如果是下划线 _ 开头就不让访问，否则就可以访问。
 */

class Dong {
  constructor() {
    this._name = "dong";
    this._age = 20;
    this.friend = "guang";
  }

  hello() {
    return "I'm " + this._name + ", " + this._age + " years old";
  }
}

const dong = new Dong();

const handler = {
  get(target, prop) {
    if (prop.startsWith("_")) {
      return;
    }
    if (typeof target[prop] === "function") {
      return target[prop].bind(target);
    }
    return target[prop];
  },
  set(target, prop, value) {
    if (prop.startsWith("_")) {
      return;
    }

    target[prop] = value;
  },
  ownKeys(target, prop) {
    return Object.keys(target).filter((key) => !key.startsWith("_"));
  },
};

const proxy = new Proxy(dong, handler);

for (const key of Object.keys(proxy)) {
  console.log(key, proxy[key]);
}

/**
 * Symbol
 *
 * Symbol 是 es2015 添加的一个 api，用于创建唯一的值。基于这个唯一的特性，我们就可以实现私有属性。
 */

const nameSymbol = Symbol("name");
const ageSymbol = Symbol("age");

class Dong {
  constructor() {
    this[nameSymbol] = "dong";
    this[ageSymbol] = 20;
  }

  hello() {
    return "I'm " + this[nameSymbol] + ", " + this[ageSymbol] + " years old";
  }
}

const dong = new Dong();
Object.keys(dong); // 获取不到；
Object.getOwnPropertySymbols(dong); // 这个api可以获取

/**
 * WeakMap
 */

const dongName = new WeakMap();
const dongAge = new WeakMap();

const classPrivateFieldSet = function (receiver, state, value) {
  state.set(receiver, value);
};

const classPrivateFieldGet = function (receiver, state) {
  return state.get(receiver);
};

class Dong {
  constructor() {
    dongName.set(this, void 0);
    dongAge.set(this, void 0);

    classPrivateFieldSet(this, dongName, "dong");
    classPrivateFieldSet(this, dongAge, 20);
  }

  hello() {
    return (
      "I'm " +
      classPrivateFieldGet(this, dongName) +
      ", " +
      classPrivateFieldGet(this, dongAge) +
      " years old"
    );
  }
}

/**
 * #prop
 */

class Dong {
  constructor() {
    this.#name = "dong";
    this.#age = 20;
    this.friend = "guang";
  }
  hello() {
    return "I'm " + this.#name + this.#age + "years old";
  }
}
