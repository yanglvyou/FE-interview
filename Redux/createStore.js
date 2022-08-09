/**
 * https://tech.meituan.com/2017/07/14/redux-design-code.html
 * http://cn.redux.js.org/understanding/thinking-in-redux/three-principles#%E4%BD%BF%E7%94%A8%E7%BA%AF%E5%87%BD%E6%95%B0%E6%9D%A5%E6%89%A7%E8%A1%8C%E4%BF%AE%E6%94%B9
 * @param {*} reducers
 * @param {*} initState
 * @param {*} enhancer
 * @returns
 */
export default function createStore(reducers, initState, enhancer) {
  // 出现多个enhancer
  if (
    (typeof initState === "function" && typeof enhancer === "function") ||
    (typeof enhancer === "function" && typeof arguments[3] === "function")
  ) {
    throw new Error("not supported");
  }

  if (typeof initState === "function" && typeof enhancer === "undefined") {
    enhancer = initState;
    initState = undefined;
  }

  if (typeof enhancer !== "undefined") {
    if (typeof enhancer !== "function") {
      throw new Error("enhancer expected to be a function");
    }
    return enhancer(createStore)(reducers, initState);
  }

  if (typeof reducers !== "function") {
    throw new Error("reducers expected to be a function");
  }

  let currentReducer = reducers;
  let currentState = initState;
  let currentListeners = []; // 避免在发布通知调用用户回调函数时抛错影响了数组
  let isDispatching = false; // 防止在 reducer 中执行，getState、dispatch、subscribe、unsubscribe

  function subscribe(listener) {
    if (typeof listener !== "function") {
      throw new Error("listener expected to be a function");
    }

    if (isDispatching) {
      throw new Error("dispatching");
    }

    let isSubscribed = true;

    currentListeners.push(listener);

    return function unsubscribe() {
      if (!isSubscribed) return;

      if (isDispatching) {
        throw new Error("dispatching");
      }

      isSubscribed = false;

      const index = currentListeners.indexOf(listener);
      currentListeners.splice(index, 1);
    };
  }

  function dispatch(action) {
    if (action == null || typeof action !== "object") {
      throw new Error("action expected to be a object");
    }

    if (typeof action.type === "undefined") {
      throw new Error("action must have type");
    }

    if (isDispatching) {
      throw new Error("Reducers may not dispatch actions.");
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    const listeners = currentListeners;

    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener();
    }

    return action;
  }

  function getState() {
    if (isDispatching) {
      throw new Error();
    }

    return currentState;
  }

  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== "function") {
      throw new Error();
    }

    currentReducer = nextReducer;

    dispatch({ type: Symbol() });

    return store;
  }

  dispatch({ type: Symbol() });

  const store = {
    getState,
    subscribe,
    dispatch,
    replaceReducer,
  };

  return store;
}
