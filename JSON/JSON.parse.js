// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/eval
// 第一种方式 eval
var json = '{"name":"小姐姐", "age":20}';
var obj = eval("(" + json + ")"); // obj 就是 json 反序列化之后得到的对象

// 第二种方式 new Function

// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function
/**
 * Function 构造函数创建的函数只能在全局作用域中运行。
 */
var json = '{"name":"小姐姐", "age":20}';
var obj = new Function("return " + json)();
