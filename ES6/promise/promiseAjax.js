const getJSON = function (url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onreadystatechange = function () {
      if (this.readyState !== 4) return;

      if (this.status === 200) {
        resolve(this.response);
      } else {
        reject(new Error(this.statusText));
      }
    };

    xhr.responseType = "json";
    xhr.setRequestHeader("Accept", "application/json");

    xhr.send();
  });
};
