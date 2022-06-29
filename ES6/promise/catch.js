Promise.prototype.catch = function (onRejected) {
    return this.then(undefined, onRejected);
}
