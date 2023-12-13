class TreeNode {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

function constructBinaryTree(nodeArray, index) {
  if (index >= nodeArray.length || nodeArray[index] === null) {
    return null;
  }

  const node = new TreeNode(nodeArray[index]);
  node.left = constructBinaryTree(nodeArray, 2 * index + 1);
  node.right = constructBinaryTree(nodeArray, 2 * index + 2);

  return node;
}

const nodeArray = [1, 2, 3, 4, 5, 6, 7];
const root = constructBinaryTree(nodeArray, 0);
console.log("root: ", root);

class TreeNode {
  constructor(val, left, right) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function findTreeDepth(root) {
  if (root === null) {
    return 0;
  }

  const leftDepth = findTreeDepth(root.left);
  const rightDepth = findTreeDepth(root.right);

  return Math.max(leftDepth, rightDepth) + 1;
}

// 创建二叉树
const root = new TreeNode(
  1,
  new TreeNode(2, new TreeNode(4), new TreeNode(5)),
  new TreeNode(3)
);

// 求二叉树的层数
const depth = findTreeDepth(root);
console.log(depth); // 输出: 3
