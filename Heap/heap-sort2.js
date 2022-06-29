// https://www.bilibili.com/video/BV1Eb41147dK?spm_id_from=333.337.search-card.all.click
// https://time.geekbang.org/column/article/69913
// https://juejin.cn/post/6844904061947346957#heading-67
function swap(tree, i, j) {
  const temp = tree[i];
  tree[i] = tree[j];
  tree[j] = temp;
}

function heapify(tree, n, i) {
  if (i >= n) return;
  const c1 = 2 * i + 1;
  const c2 = 2 * i + 2;
  let max = i;
  if (c1 < n && tree[c1] > tree[max]) {
    max = c1;
  }
  if (c2 < n && tree[c2] > tree[max]) {
    max = c2;
  }

  if (max !== i) {
    swap(tree, max, i);
    heapify(tree, n, max);
  }
}

function buildHeap(tree, n) {
  const lastNode = n - 1;
  const parent = Math.floor((lastNode - 1) / 2);
  for (let i = parent; i >= 0; i--) {
    heapify(tree, n, i);
  }
}

function buildHeapSort(tree, n) {
  buildHeap(tree, n);
  for (let i = n - 1; i >= 0; i--) {
    swap(tree, i, 0);
    heapify(tree, i, 0);
  }
}

const tree = [4, 10, 3, 5, 1, 2];
buildHeap(tree, tree.length);
// heapify(tree, tree.length - 1, 0);
buildHeapSort(tree, tree.length);
console.log(tree);
