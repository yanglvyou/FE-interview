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
      children:['It is']
    },
  ],
};
