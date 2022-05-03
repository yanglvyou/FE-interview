/**
 * 如何实现一个数组洗牌函数 shuffle
 */

// https://www.zhihu.com/question/68330851

let arr = [1, 2, 3, 4, 5];

let shuffle1 = (arr) => {
  for (let i = 1; i < arr.length; i++) {
    // 在除去已经排好的第一个元素位置以外的位置中，随机产生一个位置，该位置元素与第二个元素进行交换。
    let random = Math.floor(Math.random() * i++);
    [arr[i], arr[random]] = [arr[random], arr[i]];
  }
  return arr;
};

console.log(shuffle1(arr));


/**
 * 随机返回-0.5到0.5的值，数组顺序进行随机交换，就实现了洗牌，
 * 也可以理解为数组排序规则不固定，穿插从大到小或者从小到大，从而实现随机。
 */

const shuffle3 = arr => arr.sort(() => 0.5 - Math.random())



shuffle3([2,3,6,2,6,2]) // [6, 2, 2, 2, 3, 6]

// 为什么不通过sort来打乱数组
// 因为v8 在处理 sort 方法时，使用了插入排序和快排两种方案。当目标数组长度小于10时，使用插入排序；反之，使用快排。
// 大多数排序算法的时间复杂度介于 O(n) 到 O(n2) 之间，元素之间的比较次数通常情况下要远小于 n(n-1)/2，
// 也就意味着有一些元素之间根本就没机会相比较（也就没有了随机交换的可能），这些 sort 随机排序的算法自然也不能真正随机。

/**
 * 
 * 假设原数组长度为n，生成一个0～n-1的随机数random，然后将第random个元素跟数组最后一个元素交换
生成一个0～n-2的随机数random，然后将第random个元素跟数组倒数第二个元素交换
   以此类推，直到交换结束为止
 */
const shuffle2 = (arr) => {
  let len = arr.length,
    random;
  while (len != 0) {
    random = Math.floor(Math.random() * len--); // 无符号右移位运算符向下取整(注意这里必须加分号，否则报错)
    [arr[len], arr[random]] = [arr[random], arr[len]]; // ES6的结构赋值实现变量互换
  }
  return arr;
};

shuffle4([2, 3, 6, 2, 6, 2]); // [3, 6, 6, 2, 2, 2]
