function* fibonacci() {
  // 一个生成器函数
  let [prev, curr] = [0, 1];
  for (;;) {
    // while (true) {
    [prev, curr] = [curr, prev + curr];
    yield curr;
  }
}

for (let n of fibonacci()) {
  console.log(n);
  // 当n大于1000时跳出循环
  if (n >= 1000) break;
}

// 递归解法
function fibonacci() {
  if (n == 0 || n == 1) return n;
  return Fibonacci(n - 1) + Fibonacci(n - 2);
  // 递归解法优化
  const map = {};
  function helper(n, map) {
    if (n == 0 || n == 1) return n;
    if (map[n]) return map[n];
    map[n] = helper(n - 1, map) + helper(n - 2, map);
    return map[n];
  }
  return helper(n, map);
}

// 动态规划
function fibonacci() {
  const dp = new Array(n + 1);
  dp[0] = 0;
  dp[1] = 1;
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}

// 滑动窗口
function fibonacci() {
  let prev = 0,
    cur = 1,
    sum = 0;
  for (let i = 2; i <= n; i++) {
    sum = prev + cur;
    prev = cur;
    cur = sum;
  }
  return sum;
}
