/**
 * 快速排序
 *
 * Author: nameczz
 */

// https://time.geekbang.org/column/article/41913

const swap = (arr, i, j) => {
  if (i === j) return;
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
};

// 获取 pivot 交换完后的index
const partition = (arr, pivot, left, right) => {
  const pivotVal = arr[pivot];
  let startIndex = left;
  for (let i = left; i < right; i++) {
    if (arr[i] < pivotVal) {
      swap(arr, i, startIndex);
      startIndex++;
    }
  }
  swap(arr, startIndex, pivot);
  return startIndex;
};

const quickSort = (arr, left, right) => {
  if (left < right) {
    let pivot = right;
    let partitionIndex = partition(arr, pivot, left, right);
    quickSort(arr, left, partitionIndex - 1 < left ? left : partitionIndex - 1);
    quickSort(
      arr,
      partitionIndex + 1 > right ? right : partitionIndex + 1,
      right
    );
  }
};

const testArr = [];
let i = 0;
while (i < 10) {
  testArr.push(Math.floor(Math.random() * 1000));
  i++;
}
console.log("unsort", testArr);
quickSort(testArr, 0, testArr.length - 1);
console.log("sort", testArr);






/**

 *快速排序算法，非递归实现

 * 主要思想：利用栈实现

 * 过程：快速排序的思想就是分治法，第一趟将序列分成两部分，每一部分都可以看出一个小的序列，可以将小的序列最左最右指针下表入栈。

 * @param {number[]} arr

 * @param {number} left

 * @param {number} right

 */

let quickSort = (arr, left, right) => {

  let stack = []; //js中用数组模拟栈

  stack.push(left); //左指针入栈

  stack.push(right); //右指针入栈

  while (stack.length > 0) {  //栈不为空时，说明还有序列没有排序好

    let right = stack.pop();//后进先出，栈顶元素出栈，是为待排序列的最右下标（指针）

    let left = stack.pop(); //栈顶元素出栈，是为待排序列的最左下标（指针）

    let index = partition(arr, left, right);  //划分，将待排序列进行一趟快速排序，最终有一个数获得最终位置，其下标为index

    if (left < index - 1) { //将index将待排序列分为两部分

      stack.push(left); //左边那部分左指针入栈

      stack.push(index - 1);//左边那部分右指针入栈

    }

    if (right > index + 1) {  //右边部分入栈

      stack.push(index + 1);

      stack.push(right);

    }

  }

  return arr;  //返回数组

}

/**

*实现功能：一趟快速排序（不是一次，是一趟）

* 何为一趟排序：先在待排序的列表中(这里是数组)中取出一个数作为基准数（这里是第一个数）；

  分区过程，将比这个数大的数全放到它的右边，小于或等于它的数全放到它的左边

* 具体做法：

*

* @param {number[]} arr

* @param {number} left

* @param {number} right

* @return {number}

*/

var partition = (arr, left, right) => {

  let base = arr[left]; //基准值，数组中的第一个数，也可以选择最后一个数，中间的也行。可以优化（第一个，中间，最后一个中中间的那个数）

  while (left < right) { //循环跳出条件，注意不能等于

    while (left < right && base <= arr[right]) { //从后往前找第一个比基准值小（相等也行）的元素

      /*这里记得left < right这个条件，因为内层循环之后可能出现left>=right现象，如果没有这个条件，那么它可能会执行这个循环。

      * 记住，外层循环的条件只是管能进入外层循环，而不会管内层循环的*/

      right--;

    }

    //这句不能和下面第四句组合互换两个数，因为这里的left还是变，才到第四句

    arr[left] = arr[right]; //比基准值小的元素移动到左端

    while (left < right && base >= arr[left]) {  //从前往后找第一个比基准值大的元素   将记住这里的base有等于号

      left++;

    }

    arr[right] = arr[left]; //比基准值大的元素移动到右端

  } //跳出循环时left和right相等, 此时的left和right就是base的正确索引位置

  arr[left] = base;  //最终left=right，基准元素的最终存放位置

  return left;  //

}

let arr = [49, 38, 65, 97, 23, 22, 76, 1, 5, 8, 2, 0, -1, 22];

console.log(quickSort(arr, 0, arr.length - 1))




// https://www.ruanyifeng.com/blog/2011/04/quicksort_in_javascript.html

var quickSort = function (arr) {

  if (arr.length <= 1) { return arr; }

  var pivotIndex = Math.floor(arr.length / 2);

  var pivot = arr.splice(pivotIndex, 1)[0];

  var left = [];

  var right = [];

  for (var i = 0; i < arr.length; i++) {

    if (arr[i] < pivot) {

      left.push(arr[i]);

    } else {

      right.push(arr[i]);

    }

  }

  return quickSort(left).concat([pivot], quickSort(right));

};
