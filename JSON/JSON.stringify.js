//https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify

// https://juejin.cn/post/6999236593579982885
function myJSONStringify(data) {
  const ignoreType = ["function", "undefined", "symbol"];

  if (typeof data === "object") {
    if (data === null) return "null";

    if (data.toJSON && typeof data.toJSON === "function") {
      // 对象可能内置toJSON方法来自定义序列化对象
      return myJSONStringify(data.toJSON());
    }

    if (Array.isArray(data)) {
      let result = [];
      data.forEach((item, index) => {
        if (ignoreType.includes(typeof item)) {
          result[index] = "null";
        } else {
          result[index] = myJSONStringify(item);
        }
      });
      result = "[" + result + "]";
      return result;
    }

    const result = [];

    for (const key in data) {
      const item = data[key];

      if (item === data) {
        throw new TypeError("Converting circular structure to JSON");
      }

      if (data.hasOwnProperty(key)) {
        if (ignoreType.every((type) => type !== typeof data[key])) {
          result.push('"' + key + '"' + ":" + myJSONStringify(data[key]));
        }
      }
    }

    return "{" + result + "}";
  } else {
    if (Number.isNaN(data) || data === "Infinity") {
      return "null";
    }

    if (ignoreType.includes(typeof data)) {
      return undefined;
    }

    if (typeof data === "string") {
      return String(`"${data}"`);
    }
    return String(data);
  }
}

let test = {
  name: "name",
  age: undefined,
  func: function () {},
  sym: Symbol("setter"),
};
let newTest = StringIfy(test);
console.log(aa, newTest);
var firstObj = {
  name: "firstObj",
};
firstObj.newKey = firstObj;
StringIfy(firstObj);
