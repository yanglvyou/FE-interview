// https://juejin.cn/post/7069395092036911140
const strategies = {
  isNonEmpty: function (value, errMsg) {
    if (value === "") {
      return errMsg;
    }
  },
  minLenth: function (value, length, errMsg) {
    if (value.length < length) {
      return errMsg;
    }
  },
  isMobile: function (value, errMsg) {
    if (!/^1[3|5|8][0-9]{9}$/.test(value)) {
      return errMsg;
    }
  },
};

form.onsubmit = function () {
  const validator = new Validator();
  validator.add(form.userName, "isNonEmpty", "用户名不能为空");
  validator.add(form.password, "minLength:6", "密码长度不能少于6位");
  validator.add(form.phoneNumber, "isMobile", "手机号码格式不正确");
  const errMsg = validator.start();
  if (errMsg) {
    alert(errMsg);
    return false;
  }
};

class Validator {
  constructor() {
    this.cache = [];
  }

  add(dom, rule, errMsg) {
    const arr = rule.split(":");
    this.cache.push(() => {
      const strategy = arr.shift();
      arr.unshift(dom.value);
      arr.push(errMsg);
      return strategies[strategy].apply(dom, arr);
    });
  }

  start() {
    for (let i = 0; i < this.cache.length; i++) {
      const msg = this.cache[i]();
      if (msg) return msg;
    }
  }
}
