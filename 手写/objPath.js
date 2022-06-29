var targetObj = {
  a: {
    b: {
      c: {
        d: {
          e: {
            name: "aaaaa"
          }
        }
      }
    },
    d: "90",
    e: "90"
  },
  a2: {
    name: "bbbbb"
  },
  a3: {
    k: {
      l: {
        name: "北京"
      }
    }
  },
  a4: {
    k: {
      l: {
        name: "北京",
        author: "jin",
        version: "1.0.1"
      }
    }
  }
};

function search(object, value) {
  for (var key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      if (object[key] === value) return [key];
      if (typeof object[key] === "object") {
        const temp = search(object[key], value);
        if (temp) return [key, temp].flat();
      }
    }
  }
}
var url = search(targetObj, "北京").join("/");

console.log(url);
