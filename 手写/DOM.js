// https://juejin.cn/post/6844903731973062669
// https://juejin.cn/post/6844903954673827848
/**
 * DOM树遍历
 */

// BFS(广度优先遍历)
const parentDOM1 = document.getElementById("container");

function breathTravelSal(node) {
  const nodes = [];
  const queue = [];
  if (node) {
    queue.push(node);
    while (queue.length > 0) {
      const item = queue.shift();
      nodes.push(item);
      for (const child of item.children) {
        queue.push(child);
      }
    }
  }
  return nodes;
}

console.log(breathTravelSal(parentDOM1));

// DFS(深度优先遍历)

const parentDOM2 = document.querySelector("#container");

function deepTravelSal(node) {
  const nodes = [];
  const stack = [];
  if (node) {
    stack.push(node);
    while (stack.length) {
      const item = stack.pop();
      const len = item.children.length;
      nodes.push(item);
      for (let i = len - 1; i >= 0; i--) {
        stack.push(item.children[i]);
      }
    }
  }
  return nodes;
}
console.log(deepTravelSal(parentDOM2));

const root = {
  key: "A1",
  children: [
    {
      key: "B1",
      children: [
        {
          key: "C1",
          children: [],
        },
        {
          key: "C2",
          children: [],
        },
      ],
    },
    {
      key: "B2",
      children: [
        {
          key: "C3",
          children: [],
        },
        {
          key: "C4",
          children: [],
        },
      ],
    },
  ],
};
const walk = (dom) => {
  console.log(dom.key);
  dom.children.forEach((child) => walk(child));
};
walk(root);
