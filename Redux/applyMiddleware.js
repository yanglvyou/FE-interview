// https://blog.csdn.net/p445098355/article/details/118945445
import compose from "./compose";
export default function applyMiddleware(...middlewares) {
  return (createStore) => (reducer, initialState) => {
    const store = createStore(reducer, initialState);

    let dispatch = store.dispatch;

    const middlewareAPI = {
      getState: store.getState,
      dispatch: (action, ...args) => dispatch(action, ...args),
    };

    const chain = middlewares.map((middleware) => middleware(middlewareAPI));

    // 假设chain如下：
// chain = [
//   a: next => action => { console.log('第1层中间件') return next(action) }
//   b: next => action => { console.log('第2层中间件') return next(action) }
//   c: next => action => { console.log('根dispatch') return next(action) }
// ]
dispatch = a(b(c(dispatch)))
// 调用dispatch(action)
// 执行循序
/*
   1. 调用 a(b(c(dispatch)))(action) __print__: 第1层中间件
   2. 返回 a: next(action) 即b(c(dispatch))(action)
   3. 调用 b(c(dispatch))(action) __print__: 第2层中间件
   4. 返回 b: next(action) 即c(dispatch)(action)
   5. 调用 c(dispatch)(action) __print__: 根dispatch
   6. 返回 c: next(action) 即dispatch(action)
   7. 调用 dispatch(action)
*/
    dispatch = compose(...chain)(store.dispatch);
    return {
      ...store,
      dispatch,
    };
  };
}
