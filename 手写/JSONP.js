// https://zhuanlan.zhihu.com/p/22338759

// https://mp.weixin.qq.com/s/OdEYwfoouiest5bg9S5dHg
function JSONP({ url, params, callbackKey, callback }) {
  // 唯一 id，不存在则初始化
  JSONP.callbackId = JSONP.callbackId || 0;
  params = params || {};
  // 不要污染 window
  JSONP.callbacks = JSONP.callbacks || [];
  // 按照 id 放置 callback
  JSONP.callbacks[JSONP.callbackId] = callback;

  // 传递的 callback 名，和下面预留的一致
  params[callbackKey] = `JSONP.callbacks[${JSONP.callbackId}]`;

  const paramKeys = Object.keys(params);
  const paramString = paramKeys
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join("&");

  // const paramString = paramKeys
  // .map(key => `${key}=${params[key]}`)
  // .join('&')
  const script = document.createElement("script");
  script.setAttribute("src", `${url}?${paramString}`);
  document.body.appendChild(script);
  // id 占用，自增
  JSONP.callbackId++;
}

JSONP({
  url: "http://s.weibo.com/ajax/jsonp/suggestion",
  params: {
    key: "test",
  },
  callbackKey: "_cb",
  callback(result) {
    console.log(result.data);
  },
});
JSONP({
  url: "http://s.weibo.com/ajax/jsonp/suggestion",
  params: {
    key: "excited",
  },
  callbackKey: "_cb",
  callback(result) {
    console.log(result.data);
  },
});
