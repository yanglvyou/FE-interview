// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec
function sIndexOf(str, searchStr, fromIndex = 0) {
  var regex = new RegExp(`${searchStr}`, "ig");
  regex.lastIndex = fromIndex;
  var result = regex.exec(str);
  return result ? result.index : -1;
}

String.prototype.myIndexOf = function (searchValue = undefined, fromIndex = 0) {
  if (Object.prototype.toString.call(this) !== "[object String]") {
    throw new TypeError("need string");
  }

  const regex = new RegExp(`${searchValue}`, "g");
  regex.lastIndex = fromIndex;
  const result = regex.exec(this);
  return result ? result.index : -1;
};
