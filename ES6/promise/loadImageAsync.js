function loadImageAsync(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload=function(){
        resolve(image);
    }

    image.onerror=function(){
        reject(new TypeError('Could not load image at ' + url));
    }
    image.src=url;
  });
}
