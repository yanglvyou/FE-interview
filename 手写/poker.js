// https://zhuanlan.zhihu.com/p/82019889
//有一堆扑克牌，将牌堆第一张放到桌子上，再将接下来的牌堆的第一张放到牌底，如此往复；

// 最后桌子上的牌顺序为： (牌底) 1,2,3,4,5,6,7,8,9,10,11,12,13 (牌顶)；

// 问：原来那堆牌的顺序，用函数实现。输出 [1, 12, 2, 8, 3, 11, 4, 9, 5, 13, 6, 10, 7]

let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

/**
 *  /**
 * 1. 从牌顶拿出一张牌，放到桌子上
 * 2. 从牌顶拿出一张牌，放在牌的底部
 * 3. 重复第一步，第二步操作，知道所有的牌都放到了桌子上
 *
 * 问：已知桌子上牌的顺序是1,2,3,4,5,6,7,8,9,10,11,12,13
 * 牌原来的顺序是什么
 *
 * 分析：如果这个操作倒着来
 * 1. 从牌底部拿一张牌放到牌顶
 * 2. 从桌子上拿一张牌放到牌顶
 */

/**
 * (牌底) 1,2,3,4,5,6,7,8,9,10,11,12,13 (牌顶)；
 */

function findCardLocation(arr) {
  if (arr.length === 0) return [];
  const result = [];

  for (let i = arr.length - 1; i >= 0; i--) {
    if (result.length > 0) {
      const item = result.splice(result.length - 1, 1)[0];
      result.unshift(item);
    }
    result.unshift(arr[i]);
  }
  return result;
}

console.log(findCardLocation(arr)); // 输出 [1, 12, 2, 8, 3, 11, 4, 9, 5, 13, 6, 10, 7]

/**
 * (牌顶) 1,2,3,4,5,6,7,8,9,10,11,12,13 (牌底)。
 */

// function findCardLocation(arr) {
//     const origin = [];
//     for (let i = 0; i < arr.length; i++) {
//       if (origin.length) {
//         const item = origin.splice(origin.length - 1, 1)[0];
//         origin.unshift(item);
//       }
//       origin.unshift(arr[i]);
//     }
//     return origin;
//   }
