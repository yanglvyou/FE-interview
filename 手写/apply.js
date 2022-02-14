Function.prototype.myApply = function (context = window, args) {
  if(!Array.isArray(args)) {
    throw new TypeError('CreateListFromArrayLike called on non-object');
  }
  if (this === Function.prototype) return undefined;
  

  context = context || window;

  const fn = Symbol();
  context[fn] = this;

  let result;

  // if (Array.isArray(args)) {
  //   result = context[fn](...args);
  // } else {
  //   result = context[fn]();
  // }

  result = context[fn](...args);


  delete context[fn];

  return result;
};


