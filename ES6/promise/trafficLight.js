function timer(current, delay, next) {
  return new Promise((resolve) => {
    console.log(`当前是${current}灯，${delay}秒后变成${next}灯`);
    setTimeout(() => {
      resolve();
    }, delay * 1000);
  });
}

async function light() {
  await timer("红", 3, "绿");
  await timer("绿", 5, "黄");
  await timer("黄", 2, "红");
  await light();
}
light();

function red() {
  console.log("当前红灯");
}
function green() {
  console.log("当前绿灯");
}
function yellow() {
  console.log("当前黄灯");
}

function light(fn, timer) {
  return new Promise((resolve) => {
    fn();
    setTimeout(() => {
      resolve();
    }, 1000 * timer);
  });
}

function step() {
  Promise.resolve()
    .then(() => {
      return light(red, 3); //红灯3秒
    })
    .then(() => {
      return light(green, 5); //绿灯5秒
    })
    .then(() => {
      return light(yellow, 2); //黄灯2秒
    })
    .then(() => {
      return step();
    });
}

step();
