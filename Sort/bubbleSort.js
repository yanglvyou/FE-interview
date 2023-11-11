// 冒泡排序
const bubbleSort = (arr) => {
  if (arr.length <= 1) return;
  for (let i = 0; i < arr.length - 1; i++) {
    let hasChange = false;
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        hasChange = true;
      }
    }
    // 如果false 说明所有元素已经到位
    if (!hasChange) break;
  }
  console.log(arr);
};
