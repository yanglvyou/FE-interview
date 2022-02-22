function* fibonacci() { // 一个生成器函数
  let [prev, curr] = [0, 1];
  for (; ;) { // while (true) {
    [prev, curr] = [curr, prev + curr];
    yield curr;
  }
}

for (let n of fibonacci()) {
  console.log(n);
  // 当n大于1000时跳出循环
  if (n >= 1000)
    break;
}
