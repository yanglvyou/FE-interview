/**
 * 二分查找
 *
 * Author: nameczz
 */
// 数组必须有序 不存在重复 https://time.geekbang.org/column/article/42520
const binaryFind = (sortedArr, target) => {
  if (sortedArr.length === 0) return -1;
  let low = 0;
  let high = sortedArr.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (target === sortedArr[mid]) {
      return mid;
    } else if (target < sortedArr[mid]) {
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }
  return -1;
};
// // 二分查找的递归实现
// public int bsearch(int[] a, int n, int val) {
//   return bsearchInternally(a, 0, n - 1, val);
// }

// private int bsearchInternally(int[] a, int low, int high, int value) {
//   if (low > high) return -1;

//   int mid =  low + ((high - low) >> 1);
//   if (a[mid] == value) {
//     return mid;
//   } else if (a[mid] < value) {
//     return bsearchInternally(a, mid+1, high, value);
//   } else {
//     return bsearchInternally(a, low, mid-1, value);
//   }
// }



const arr = [1, 4, 5, 6, 7, 8, 10, 11, 23, 42, 44, 54, 56, 77, 102];
console.log(binaryFind(arr, 44));
console.log(binaryFind(arr, 1));
console.log(binaryFind(arr, 102));
console.log(binaryFind(arr, 1111));

搜索旋转排序数组; // https://leetcode-cn.com/problems/search-in-rotated-sorted-array/
