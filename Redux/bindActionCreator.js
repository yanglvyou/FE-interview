function bindActionCreator(actionCreator, dispatch) {
  return function () {
    return dispatch(actionCreator.apply(this, arguments));
  };
}

export default function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === "function") {
    return bindActionCreator(actionCreators, dispatch);
  }

  if (actionCreators == null || typeof actionCreators !== "object") {
    throw new Error("bindActionCreators expected an object or function");
  }

  const keys = Object.keys(actionCreators);

  const bindActionCreators = {};

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const actionCreator = actionCreators[key];

    if (typeof actionCreator === "function") {
      bindActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }

    return bindActionCreators;
  }
}