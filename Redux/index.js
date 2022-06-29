// https://tech.meituan.com/2017/07/14/redux-design-code.html
// https://cn.redux.js.org/api/bindactioncreators
import createStore from "./createStore";
import combineReducers from "./combineReducers";
import compose from "./compose";
import applyMiddleware from "./applyMiddleware";
import bindActionCreators from "./bindActionCreator";

export {
  createStore,
  combineReducers,
  compose,
  applyMiddleware,
  bindActionCreators,
};
