const obj = {
  tag: "div",
  children: [{ tag: "span", children: "hello world" }],
};

function render(obj, root) {
  const el = document.createElement(obj.tag);
  if (typeof obj.children === "string") {
    const text = document.createTextNode(obj.children);
    el.appendChild(text);
  } else if (obj.children) {
    obj.children.forEach((child) => render(child, el));
  }
  root.appendChild(el);
}
