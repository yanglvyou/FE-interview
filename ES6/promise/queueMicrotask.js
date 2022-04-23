// https://developer.mozilla.org/zh-CN/docs/Web/API/HTML_DOM_API/Microtask_guide
if (typeof window.queueMicrotask !== "function") {
  window.queueMicrotask = function (callback) {
    Promise.resolve()
      .then(callback)
      .catch(e => setTimeout(() => { throw e; }));
  };
}
