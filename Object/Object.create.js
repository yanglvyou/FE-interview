// Object.create()方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__。

Object.create = function (proto, properties = {}) {
  if (typeof proto !== "object" && typeof proto !== "function") {
    throw new TypeError();
  }

  var newObj = {};

  newObj.__proto__ = proto;

  Object.defineProperties(newObj, properties);

  return newObj;
};

if (typeof Object.create !== "function") {
  Object.create = function (proto, propertiesObject) {
    if (typeof proto !== "object" && typeof proto !== "function") {
      throw new TypeError("Object prototype may only be an Object: " + proto);
    } else if (proto === null) {
      throw new Error(
        "This browser's implementation of Object.create is a shim and doesn't support 'null' as the first argument."
      );
    }

    if (typeof propertiesObject !== "undefined")
      throw new Error(
        "This browser's implementation of Object.create is a shim and doesn't support a second argument."
      );

    function F() {}
    F.prototype = proto;

    return new F();
  };
}
