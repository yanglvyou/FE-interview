//https://segmentfault.com/a/1190000014196851
// https://www.imooc.com/read/38/article/482

// https://segmentfault.com/a/1190000014196851

//  简单工厂模式
let UserFactory = function (role) {
  function User(opt) {
    this.name = opt.name;
    this.viewPage = opt.viewPage;
  }

  switch (role) {
    case "superAdmin":
      return new User({
        name: "超级管理员",
        viewPage: ["首页", "通讯录", "发现页", "应用数据", "权限管理"],
      });
      break;
    case "admin":
      return new User({
        name: "管理员",
        viewPage: ["首页", "通讯录", "发现页", "应用数据"],
      });
      break;
    case "user":
      return new User({
        name: "普通用户",
        viewPage: ["首页", "通讯录", "发现页"],
      });
      break;
    default:
      throw new Error("参数错误, 可选参数:superAdmin、admin、user");
  }
};

//调用
let superAdmin = UserFactory("superAdmin");
let admin = UserFactory("admin");
let normalUser = UserFactory("user");

// 简单工厂的优点在于，你只需要一个正确的参数，就可以获取到你所需要的对象，而无需知道其创建的具体细节。
// 但是在函数内包含了所有对象的创建逻辑（构造函数）和判断逻辑的代码，每增加新的构造函数还需要修改判断逻辑代码。
//当我们的对象不是上面的3个而是30个或更多时，这个函数会成为一个庞大的超级函数，便得难以维护。
//所以，简单工厂只能作用于创建的对象数量较少，对象的创建逻辑不复杂时使用。



/* 工厂类 */
class Factory {
  static getInstance(type) {
    switch (type) {
      case "Product1":
        return new Product1();
      case "Product2":
        return new Product2();
      default:
        throw new Error("当前没有这个产品");
    }
  }
}

/* 产品类1 */
class Product1 {
  constructor() {
    this.type = "Product1";
  }

  operate() {
    console.log(this.type);
  }
}

/* 产品类2 */
class Product2 {
  constructor() {
    this.type = "Product2";
  }

  operate() {
    console.log(this.type);
  }
}

const prod1 = Factory.getInstance("Product1");
prod1.operate(); // 输出: Product1
const prod2 = Factory.getInstance("Product3"); // 输出: Error 当前没有这个产品
