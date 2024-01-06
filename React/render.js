// https://github.com/hujiulong/blog/issues/4
function render(vNode, container) {
  container = container || document.createElement("div");

  if (typeof vNode === "string") {
    const textNode = document.createTextNode(vNode);
    return container.appendChild(textNode);
  }

  const dom = document.createElement(vNode.tag);

  if (vNode.attrs) {
    Object.keys(vNode.attrs).forEach((key) => {
      const value = vNode.attrs[key];
      setAttribute(dom, key, value);
    });
  }

  vNode.children.forEach((child) => render(child, dom));

  return container.appendChild(dom);
}

function setAttribute(dom, name, value) {
  // 如果属性名是className，则改回class
  if (name === "className") name = "class";

  // 如果属性名是onXXX，则是一个时间监听方法
  if (/on\w+/.test(name)) {
    name = name.toLowerCase();
    dom[name] = value || "";
  } else if (name === "style") {
    if (typeof value === "string") {
      throw new TypeError(
        "The `style` prop expects a mapping from style properties to values, not a string."
      );
    } else if (value && typeof value === "object") {
      // 可以通过style={ {width: 20 }}这种形式来设置样式，可以省略掉单位px
      for (let name in value) {
        dom.style[name] =
          typeof value[name] === "number" ? value[name] + "px" : value[name];
      }
    }
  } else {
    // 普通属性则直接更新属性
    if (name in dom) {
      dom[name] = value || "";
    }

    if (value) {
      dom.setAttribute(name, value);
    } else {
      dom.removeAttribute(name);
    }
  }
}

const element = (
  <div>
    <h1 onClick={() => {}}>Hello, world!</h1>
    <h2 style={{ color: "red" }} className="title">
      It is
    </h2>
  </div>
);

const jsx = {
  tag: "div",
  attrs: null,
  children: [
    {
      tag: "h1",
      attrs: {
        onClick: () => {},
      },
      children: ["Hello, world!"],
    },
    {
      tag: "h2",
      attrs: {
        color: "red",
        className: "title",
      },
      children: ["It is"],
    },
  ],
};

// https://github.com/QuarkGluonPlasma/frontend-framework-exercize/blob/main/render-vdom/dong.js
// https://juejin.cn/post/7055364698136379423

const element2 = {
  type: "ul",
  props: {
    className: "list",
  },
  children: [
    {
      type: "li",
      props: {
        className: "item",
        style: {
          background: "blue",
          color: "#fff",
        },
        onClick: function () {
          alert(1);
        },
      },
      children: ["aaaa"],
    },
    {
      type: "li",
      props: {
        className: "item",
      },
      children: ["bbbbddd"],
    },
    {
      type: "li",
      props: {
        className: "item",
      },
      children: ["cccc"],
    },
  ],
};

function isTextVdom(vdom) {
  return typeof vdom == "string" || typeof vdom == "number";
}

function isElementVdom(vdom) {
  return typeof vdom == "object" && typeof vdom.type == "string";
}

const render = (vdom, parent = null) => {
  const mount = parent ? (el) => parent.appendChild(el) : (el) => el;
  if (isTextVdom(vdom)) {
    return mount(document.createTextNode(vdom));
  } else if (isElementVdom(vdom)) {
    const dom = mount(document.createElement(vdom.type));
    for (const child of vdom.children) {
      render(child, dom);
    }
    for (const prop in vdom.props) {
      setAttribute(dom, prop, vdom.props[prop]);
    }
    return dom;
  } else {
    throw new Error(`Invalid VDOM: ${vdom}.`);
  }
};

function isEventListenerAttr(key, value) {
  return typeof value == "function" && key.startsWith("on");
}

function isStyleAttr(key, value) {
  return key == "style" && typeof value == "object";
}

function isPlainAttr(key, value) {
  return typeof value !== "object" && typeof value !== "function";
}

const setAttribute = (dom, key, value) => {
  if (isEventListenerAttr(key, value)) {
    const eventType = key.slice(2).toLowerCase();
    dom.addEventListener(eventType, value);
  } else if (isStyleAttr(key, value)) {
    Object.assign(dom.style, value);
  } else if (isPlainAttr(key, value)) {
    dom.setAttribute(key, value);
  }
};

const JSX = {
  type: "ul",
  props: {
    className: "list",
  },
  children: [
    {
      type: "li",
      props: {
        className: "item",
        style: {
          background: "blue",
          color: "#fff",
        },
        onClick: function () {
          alert(11);
        },
      },
      children: ["aaaa"],
    },
    {
      type: "li",
      props: {
        className: "item",
        style: {
          background: "red",
          fontSize: "30px",
        },
      },
      children: ["bbbbddd"],
    },
    {
      type: "li",
      props: {
        className: "item",
      },
      children: ["cccc"],
    },
  ],
};

const vnode = {
  tag: "div",
  props: {
    onClick: () => alert("hello"),
  },
  children: "click me",
};

function renderer(vnode, container) {
  // 使用 vnode.tag 作为标签名称创建 DOM 元素
  const el = document.createElement(vnode.tag);
  // 遍历 vnode.props，将属性、事件添加到 DOM 元素
  for (const key in vnode.props) {
    if (/^on/.test(key)) {
      // 如果 key 以 on 开头，说明它是事件
      el.addEventListener(
        key.substr(2).toLowerCase(), // 事件名称 onClick ---> click
        vnode.props[key] // 事件处理函数
      );
    }
  }

  // 处理 children
  if (typeof vnode.children === "string") {
    // 如果 children 是字符串，说明它是元素的文本子节点
    el.appendChild(document.createTextNode(vnode.children));
  } else if (Array.isArray(vnode.children)) {
    // 递归地调用 renderer 函数渲染子节点，使用当前元素 el 作为挂载点
    vnode.children.forEach((child) => renderer(child, el));
  }

  // 将元素添加到挂载点下
  container.appendChild(el);
}
