// https://segmentfault.com/a/1190000040563214
/**
 *
 * 字符串 trim 方法模拟
 * @returns
 */
function trim(str) {
  return str.replace(/^\s+|\s+$/g, "");
}

/**
 *
 * 首字母转为大写
 * @returns
 */

function firstUpCase(str) {
  return str.toLowerCase().replace(/(^|\s)\w/g, function (c) {
    return c.toUpperCase();
  });
}

/**
 *
 * 驼峰化
 * @returns
 */

function camelize(str) {
  return str.replace(/[-_\s]+(.)?/g, function (match, c) {
    console.log(match, c, 22);
    return c ? c.toUpperCase() : "";
  });
}

console.log(camelize("-moz-transform"));

/**
 * 
 * @param {*} str 
 * @returns 
 */
function dasherize(str) {
  return str
    .replace(/([A-Z])/g, "-$1")
    .replace(/[-_\s]+/g, "-")
    .toLowerCase();
}
console.log(dasherize("MozTransform"));
