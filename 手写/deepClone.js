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
  // ????????????????????????
  if (!isObject(target)) return target;

  const type = getType(target);

  let cloneTarget;
  if (deepType.includes(type)) {
    //???????????????????????????????????????
    const Ctor = target.constructor;
    cloneTarget = new Ctor();
  } else {
    return cloneOtherType(target, type);
  }

  // ??????????????????
  if (map.get(target)) {
    return map.get(target);
  }

  map.set(target, cloneTarget);
  // ??????Map
  if (type === mapType) {
    target.forEach((value, key) => {
      cloneTarget.set(key, deepClone(value, map));
    });

    return cloneTarget;
  }

  // ??????Set

  if (type === setType) {
    target.forEach((value) => {
      cloneTarget.add(deepClone(value, map));
    });

    return cloneTarget;
  }

  // ?????????????????????
  for (const key in target) {
    if (target.hasOwnProperty(key)) {
      cloneTarget[key] = deepClone(target[key], map);
      //  // ?????? DOM ????????????
      // } else if ((typeof sourceObj[key] === 'object') && sourceObj[key].nodeType === 1 ) {
      //   // ?????? DOM ????????????
      //   let domEle = document.getElementsByTagName(sourceObj[key].nodeName)[0];
      //   newObj[key] = domEle.cloneNode(true);
    }

    return cloneTarget;
  }
}

const map = new Map();
map.set("key", "value");
map.set("ConardLi", "code????????????");

const set = new Set();
set.add("ConardLi");
set.add("code????????????");

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
    console.log("code????????????");
  },
  func2: function (a, b) {
    return a + b;
  },
};
