// 大数相加

let a = "9007199254740991";
let b = "1234567899999999999";

// https://leetcode-cn.com/problems/add-strings/solution/zi-fu-chuan-xiang-jia-by-leetcode-solution/
function addStrings(a, b) {
  let i = a.length - 1,
    j = b.length - 1;
  let carry = 0;

  const res = [];

  while (i >= 0 || j >= 0 || carry != 0) {
    const x = i >= 0 ? a[i] - "0" : 0; // 隐式转换
    const y = j >= 0 ? b[j] - "0" : 0;
    const result = x + y + carry;
    res.unshift(result % 10);
    carry = Math.floor(result / 10);
    i--;
    j--;
  }

  return res.join("");
}

function add(a, b) {
  const maxLength = Math.max(a.length, b.length);
  a = a.padStart(maxLength, 0);
  b = b.padStart(maxLength, 0);
  let add = 0;
  let carry = 0;
  let sum = "";
  for (let i = maxLength - 1; i >= 0; i--) {
    add = parseInt(a[i]) + parseInt(b[i]) + carry;
    carry = Math.floor(add / 10);
    sum = (add % 10) + sum;
  }

  if (carry === "1") {
    sum = "1" + sum;
  }
  return sum;
}

console.log(add(a, b)); // 结果为：1243575099254740990
