// https://github.com/BetaSu/fe-hunter/issues/53#issuecomment-1092382804

// 可以继续遍历的类型
const objectToInit = ["Object", "Array", "Set", "Map", "Arguments"];

// 判断是否是引用类型
function isObject(o) {
  return o !== null && (typeof o === "object" || typeof o === "function");
}
// 判断具体的数据类型
function getType(o) {
  return Object.prototype.toString.call(o).slice(8, -1);
}
// 初始化函数
function initCloneTarget(target) {
  return new target.constructor();
}
// 拷贝 Symbol
function cloneSymbol(target) {
  return Object(target.valueOf());
  // 或者
  return Object(Symbol.prototype.valueOf.call(target));
  // 或者
  return Object(Symbol(target.description));
}
// 拷贝正则对象
function cloneReg(target) {
  const reFlags = /\w*$/;
  const result = new RegExp(target.source, reFlags.exec(target));
  result.lastIndex = target.lastIndex;
  return result;
}
// 拷贝函数
function cloneFunction(target) {
  return eval(`(${target})`);
  // 或者
  return new Function(`return (${target})()`);
}

// 处理不能继续遍历的类型
function directCloneTarget(target, type) {
  let _constructor = target.constructor;
  switch (type) {
    case "String":
    case "Boolean":
    case "Number":
    case "Error":
    case "Date":
      return new _constructor(target.valueOf());
      // 或者
      return new Object(_constructor.prototype.valueOf.call(target));
    case "RegExp":
      return cloneReg(target);
    case "Symbol":
      return cloneSymbol(target);
    case "Function":
      return cloneFunction(target);
    default:
      return null;
  }
}

// 深拷贝的核心代码
function deepClone(target, map = new WeakMap()) {
  // 如果是基本类型，直接返回即可
  if (!isObject(target)) return target;
  // 初始化
  let type = getType(target);
  let cloneTarget;
  if (objectToInit.includes(type)) {
    cloneTarget = initCloneTarget(target);
  } else {
    return directCloneTarget(target, type);
  }
  // 解决循环引用
  if (map.has(target)) return map.get(target);
  map.set(target, cloneTarget);
  // 拷贝 Set
  if (type === "Set") {
    target.forEach((value) => {
      cloneTarget.add(deepClone(value, map));
    });
  }
  // 拷贝 Map
  else if (type === "Map") {
    target.forEach((value, key) => {
      cloneTarget.set(key, deepClone(value, map));
    });
  }
  // 拷贝对象字面量、数组、类数组对象
  else if (type === "Object" || type === "Array" || type === "Arguments") {
    // Reflect.ownKeys(target).forEach((key) => {
    //   cloneTarget[key] = deepClone(target[key], map);
    // });
    if (target.hasOwnProperty(key)) {
      if (target[key] && target[key].nodeType && target[key].nodeType === 1) {
        let domEle = document.getElementsByTagName(target[key].nodeName)[0];
        cloneTarget[key] = domEle.cloneNode(true);
      } else {
        cloneTarget[key] = deepClone(target[key], map);
      }
    }
  }
  return cloneTarget;
}

// https://juejin.cn/post/6844903929705136141
const mapType = "[object Map]";
const setType = "[object Set]";
const arrayType = "[object Array]";
const objectType = "[object Object]";

const boolType = "[object Boolean]";
const numType = "[object Number]";
const stringType = "[object String]";
const symType = "[object Symbol]";
const dateType = "[object Date]";
const regType = "[object RegExp]";
const errorType = "[object Error]";
const funcType = "[object Function]";

const deepType = [mapType, setType, arrayType, objectType];

function isObject(target) {
  const type = typeof target;
  return target !== null && type === "object";
  // return Object.prototype.toString.call(target) === "[object Object]";
}

function getType(target) {
  return Object.prototype.toString.call(target);
}

function cloneSymbol(target) {
  return Object(Symbol.prototype.valueOf.call(target));
}

// https://juejin.cn/post/6844903775384125448

function cloneRegExp(target) {
  const reFlags = /\w*$/;
  const result = new target.constructor(target.source, reFlags.exec(target));
  result.lastIndex = target.lastIndex;
  return result;
}

function cloneFunction(func) {
  const bodyReg = /(?<={)(.|\n)+(?=})/m;
  const paramReg = /(?<=\().+(?=\)\s+{)/;
  const funcString = func.toString();
  if (func.prototype) {
    const param = paramReg.exec(funcString);
    const body = bodyReg.exec(funcString);
    if (body) {
      if (param) {
        const paramArr = param[0].split(",");
        return new Function(...paramArr, body[0]);
      } else {
        return new Function(body[0]);
      }
    } else {
      return null;
    }
  } else {
    return eval(funcString);
  }
}

function cloneOtherType(target, type) {
  const Ctor = target.constructor;
  switch (type) {
    case boolType:
    case numType:
    case stringType:
    case dateType:
    case errorType:
      return new Ctor(target);
    case symType:
      return cloneSymbol(target);
    case regType:
      return cloneRegExp(target);
    case funcTag:
      return cloneFunction(target);
    default:
      return null;
  }
}

function deepClone(target, map = new WeakMap()) {
  // 克隆原始数据类型
  if (!isObject(target)) return target;

  const type = getType(target);

  let cloneTarget;
  if (deepType.includes(type)) {
    //可以保证对象的原型不丢失！
    const Ctor = target.constructor;
    cloneTarget = new Ctor();
  } else {
    return cloneOtherType(target, type);
  }

  // 防止循坏引用
  if (map.get(target)) {
    return map.get(target);
  }

  map.set(target, cloneTarget);
  // 克隆Map
  if (type === mapType) {
    target.forEach((value, key) => {
      cloneTarget.set(key, deepClone(value, map));
    });

    return cloneTarget;
  }

  // 克隆Set

  if (type === setType) {
    target.forEach((value) => {
      cloneTarget.add(deepClone(value, map));
    });

    return cloneTarget;
  }

  // 克隆对象和数组
  for (const key in target) {
    if (target.hasOwnProperty(key)) {
      cloneTarget[key] = deepClone(target[key], map);
      //  // 判断 DOM 元素节点
      // } else if ((typeof sourceObj[key] === 'object') && sourceObj[key].nodeType === 1 ) {
      //   // 判断 DOM 元素节点
      //   let domEle = document.getElementsByTagName(sourceObj[key].nodeName)[0];
      //   newObj[key] = domEle.cloneNode(true);
    }

    return cloneTarget;
  }
}

const map = new Map();
map.set("key", "value");
map.set("ConardLi", "code秘密花园");

const set = new Set();
set.add("ConardLi");
set.add("code秘密花园");

const target = {
  field1: 1,
  field2: undefined,
  field3: {
    child: "child",
  },
  field4: [2, 4, 8],
  empty: null,
  map,
  set,
  bool: new Boolean(true),
  num: new Number(2),
  str: new String(2),
  symbol: Object(Symbol(1)),
  date: new Date(),
  reg: /\d+/,
  error: new Error(),
  func1: () => {
    console.log("code秘密花园");
  },
  func2: function (a, b) {
    return a + b;
  },
};



// 判断是否是引用类型
function isObject(target) {
  return (
    target !== null &&
    (typeof target === "object" || typeof target === "function")
  );
}

// 获取具体的数据类型
function getType(target) {
  return Object.prototype.toString.call(target).slice(8, -1);
}

// 可以继续遍历的数据类型
const canTraverseType = ["Array", "Object", "Map", "Set", "Arguments"];

// 初始化target
function initCloneTarget(target) {
  return new target.constructor();
}

// 克隆Symbol
function cloneSymbol(target) {
  return Object(Symbol.prototype.valueOf.call(target));
}

// 拷贝函数
function cloneFunction(target) {
  return new Function(`return (${target})()`);
}

// 拷贝正则表达式
function cloneRegExp(target) {
  const expFlags = /\w*$/;
  const result = new target.constructor(target.source, expFlags.exec(target));
  result.lastIndex = target.lastIndex;
  return result;
}

// 处理不能遍历的数据类型
function directCloneTarget(target, type) {
  let _constructor = target.constructor;
  switch (type) {
    case "Boolean":
    case "String":
    case "Number":
    case "Date":
    case "Error":
      return new _constructor(target.valueOf());
    case "Symbol":
      return cloneSymbol(target);
    case "Function":
      return cloneFunction(target);
    case "RegExp":
      return cloneRegExp(target);
    default:
      return null;
  }
}

function deepClone(target, map = new WeakMap()) {
  // 基本类型直接返回
  if (!isObject(target)) return target;
  // 获取 target 具体的数据类型
  const type = getType(target);
  let cloneTarget;
  if (canTraverseType.includes(type)) {
    cloneTarget = initCloneTarget(target);
  } else {
    return directCloneTarget(target, type);
  }

  // 解决循环引用问题
  if (map.has(target)) {
    return map.get(target);
  }
  map.set(target, cloneTarget);

  // 拷贝set对象
  if (type === "Set") {
    target.forEach((value) => {
      cloneTarget.add(deepClone(value, map));
    });
  } else if (type === "Map") {
    // map对象
    target.forEach((value, key) => {
      cloneTarget.set(key, deepClone(value, map));
    });
  } else if (type === "Object" || type === "Array") {
    for (const key in target) {
      if (target.hasOwnProperty(key)) {
        if (target[key] && target[key].nodeType && target[key].nodeType === 1) {
          let domEle = document.getElementsByTagName(target[key].nodeName)[0];
          cloneTarget[key] = domEle.cloneNode(true);
        } else {
          cloneTarget[key] = deepClone(target[key], map);
        }
      }
    }
  }

  return cloneTarget;
}

const map = new Map();
map.set("key", "value");

const set = new Set();
set.add("中国");

const obj = {
  a: 1,
  b: false,
  c: undefined,
  d: null,
  e: Symbol(1),
  f: [1, 2, 3],
  g: {
    name: "yang",
  },
  h: null,
  map,
  set,
  date: new Date(),
  error: new Error("出错了"),
  ref: /\d+/g,
  bol: new Boolean(true),
  str: new String("str"),
  num: new Number(10),
  func1: () => {
    console.log("func1");
  },
  func2: function (a, b) {
    return a + b;
  },
  html: document.body,
};

obj.obj = obj;

const cloneObj = deepClone(obj);

obj.f.push(1000);
obj.g.name = "xiaoming";
obj.map.set("key", 100);

console.log(obj);

console.log(cloneObj);
