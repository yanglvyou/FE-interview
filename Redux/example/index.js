import { createStore } from "./../index";

import reducers from "./reducers/index";
import bindActionCreators from "./../bindActionCreators";

import * as TodoActionCreators from "./../TodoActionCreators";

import applyMiddleware from "./../applyMiddleware";
function logger({ getState }) {
  return (next) => (action) => {
    console.log("logger1", action);

    console.log(next, "next", 1);

    // 调用 middleware 链中下一个 middleware 的 dispatch。
    const returnValue = next(action);

    console.log("state after dispatch", getState(), 1);

    // 一般会是 action 本身，除非
    // 后面的 middleware 修改了它。
    return returnValue;
  };
}
function logger2({ getState }) {
  return (next) => (action) => {
    console.log("logger2", action);

    console.log(next, "next", 2);

    // 调用 middleware 链中下一个 middleware 的 dispatch。
    const returnValue = next(action);

    console.log("state after dispatch", getState(), 2);

    // 一般会是 action 本身，除非
    // 后面的 middleware 修改了它。
    return returnValue;
  };
}

const store = createStore(reducers, applyMiddleware(logger, logger2));
console.log(TodoActionCreators, 6666);
const boundActionCreators = bindActionCreators(
  TodoActionCreators,
  store.dispatch
);

console.log(boundActionCreators.addTodo("时间简史"), 88888);

store.subscribe(() => {
  console.log(store.getState());
});

// store.dispatch({ type: "decremented" });
store.dispatch({ type: "INCREMENT" });
