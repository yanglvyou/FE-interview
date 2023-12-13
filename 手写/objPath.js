var targetObj = {
  a: {
    b: {
      c: {
        d: {
          e: {
            name: "aaaaa",
          },
        },
      },
    },
    d: "90",
    e: "90",
  },
  a2: {
    name: "bbbbb",
  },
  a3: {
    k: {
      l: {
        name: "北京",
      },
    },
  },
  a4: {
    k: {
      l: {
        name: "北京",
        author: "jin",
        version: "1.0.1",
      },
    },
  },
};

function search(object, value) {
  for (var key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      if (typeof object[key] === "object") {
        const temp = search(object[key], value);
        if (temp) return [key, temp].flat();
      }
      if (object[key] === value) return [key];
    }
  }
}
var url = search(targetObj, "北京").join("/");

console.log(url);

/**
 * https://segmentfault.com/a/1190000040339852
 */

const dataSource = [
  {
    label: "首页",
    value: 1,
  },
  {
    label: "商品分类",
    value: 2,
    child: [
      {
        label: "服饰",
        value: 21,
        child: [
          {
            label: "精美女装",
            value: 211,
          },
        ],
      },
      {
        label: "地方特产",
        value: 22,
        child: [
          {
            label: "河南特产",
            value: 221,
            child: [
              {
                label: "方中山胡辣汤",
                value: 2211,
              },
              {
                label: "烩面",
                value: 2212,
              },
            ],
          },
          {
            label: "上海特产",
            value: 222,
          },
        ],
      },
    ],
  },
  {
    label: "我的",
    value: 3,
    child: [
      {
        label: "基本信息",
        value: 31,
      },
      {
        label: "我的订单",
        value: 33,
        child: [
          {
            label: "全部订单",
            value: 331,
          },
          {
            label: "待收货",
            value: 332,
          },
        ],
      },
    ],
  },
];

const getTargetPathValue = (data, target) => {
  if (!data || data.length === 0) return [];
  let res = [];
  const pathsValue = (data, target, path) => {
    for (const item of data) {
      path.push(item.value);
      if (item.value === target) {
        res = path.slice();
        return;
      }
      if (item.child) {
        pathsValue(item.child, target, path);
      }
      path.pop();
    }
  };
  pathsValue(data, target, []);
  return res;
};

console.log(getTargetPathValue(dataSource, 211));

const tree = {
  name: "部门1",
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
};

function getTarget(root, name) {
  const helper = (root, name) => {
    if (root == null) return;

    if (root.name === name) {
      return root;
    }

    if (root.children.length) {
      for (let node of root.children) {
        const res = getTarget(node, name);
        if (res) {
          return res;
        }
      }
    }
    return null;
  };
  return helper(root, name);
}

console.log(getTarget(tree, "部门31"));
