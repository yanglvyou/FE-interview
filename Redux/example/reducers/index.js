import combineReducers from "../../combineReducers";
import todos from "./todos";
import counter from "./counter";

export default combineReducers({ todos, counter });
