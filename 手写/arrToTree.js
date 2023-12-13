// https://juejin.cn/post/6983904373508145189

let arr = [
  { id: 1, name: "部门1", pid: 0 },
  { id: 2, name: "部门2", pid: 1 },
  { id: 3, name: "部门3", pid: 1 },
  { id: 4, name: "部门4", pid: 3 },
  { id: 5, name: "部门5", pid: 4 },
];

const tree = [
  {
    id: 1,
    name: "部门1",
    pid: 0,
    children: [
      {
        id: 2,
        name: "部门2",
        pid: 1,
        children: [],
      },
      {
        id: 3,
        name: "部门3",
        pid: 1,
        children: [
          // 结果 ,,,
        ],
      },
    ],
  },
];

//1、 不考虑性能实现，递归遍历查找
function getChildren(data, result, pid) {
  for (const item of data) {
    if (item.pid === pid) {
      const newItem = { ...item, children: [] };
      result.push(newItem);
      getChildren(data, newItem.children, item.id);
    }
  }
}

const arrToTree = (arr, pid) => {
  const result = [];
  getChildren(arr, result, pid);
  return result;
};

// chatGPT

function buildTree(arr, parentId = 0) {
  const result = [];

  arr.forEach((node) => {
    if (node.pid === parentId) {
      const children = buildTree(arr, node.id);
      if (children.length) {
        node.children = children;
      }
      result.push(node);
    }
  });

  return result;
}

// 2、不用递归，也能搞定
function arrayToTree(arr) {
  const result = [];
  const itemMap = {};

  // 存储
  for (let item of arr) {
    itemMap[item.id] = { ...item, children: [] };
  }

  for (const item of arr) {
    const id = item.id;
    const pid = item.pid;
    const treeItem = itemMap[id];

    if (pid === 0) {
      result.push(treeItem);
    } else {
      if (!itemMap[pid]) {
        itemMap[pid] = {
          children: [],
        };
      }
      itemMap[pid].children.push(treeItem);
    }
  }

  return result;
}

// chatGPT
function buildTree(arr) {
  const map = {};
  const roots = [];

  arr.forEach((node) => {
    map[node.id] = { ...node, children: [] };
  });

  arr.forEach((node) => {
    const parent = map[node.pid];
    if (parent) {
      parent.children.push(map[node.id]);
    } else {
      roots.push(map[node.id]);
    }
  });

  return roots;
}

// 3、最优性能

function arrayToTree(items) {
  const result = []; // 存放结果集
  const itemMap = {}; //
  for (const item of items) {
    const id = item.id;
    const pid = item.pid;

    if (!itemMap[id]) {
      itemMap[id] = {
        children: [],
      };
    }

    itemMap[id] = {
      ...item,
      children: itemMap[id]["children"],
    };

    const treeItem = itemMap[id];

    if (pid === 0) {
      result.push(treeItem);
    } else {
      if (!itemMap[pid]) {
        itemMap[pid] = {
          children: [],
        };
      }
      itemMap[pid].children.push(treeItem);
    }
  }
  return result;
}

// JSON树型结构转换扁平结构
function flatten(data) {
  return data.reduce(
    (arr, { id, title, pid, children = [] }) =>
      arr.concat([{ id, title, pid }], flatten(children)),
    []
  );
}
let flatArr = flatten(JsonTree);
console.log(flatArr);

let JsonTree = [
  { id: 1, title: "解忧杂货铺1", pid: 0 },
  {
    id: 2,
    title: "解忧杂货铺2",
    pid: 0,
    children: [
      { id: 6, title: "解忧杂货铺4-2", pid: 2 },
      {
        id: 3,
        title: "解忧杂货铺2-1",
        pid: 2,
        children: [
          {
            id: 4,
            title: "解忧杂货铺3-1",
            pid: 3,
            children: [{ id: 5, title: "解忧杂货铺4-1", pid: 4 }],
          },
        ],
      },
    ],
  },
];

const arr2 = [
  { id: 1 },
  { id: 2, pId: 1 },
  { id: 3, pId: 2 },
  { id: 4 },
  { id: 3, pId: 2 },
  { id: 5, pId: 4 },
];

const fn = (arr2) => {
  const res = [];

  const map = arr2.reduce((res, item) => ((res[item.id] = item), res), {});

  for (const item of Object.values(map)) {
    if (!item.pId) {
      res.push(item);
    } else {
      const parent = map[item.pId];
      parent.child = parent.child || [];
      parent.child.push(item);
    }
  }
  return res;
};

console.log(fn(arr2));
