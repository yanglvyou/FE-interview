//如果它不是质数，那么它一定可以表示成两个数（除了1和它本身）相乘，这两个数必然有一个小于等于它的平方根。只要找到小于或等于的那个就行了
function isPrime(element, index, array) {
  var start = 2;
  while (start <= Math.sqrt(element)) {
    if (element % start++ < 1) {
      return false;
    }
  }
  return element > 1;
}

console.log([4, 6, 8, 12].find(isPrime)); // undefined, not found
console.log([4, 5, 8, 12].find(isPrime)); // 5


// function isPrime(element){
//   if(element <2) return false;
//   let start=2;

//   while(start<=Math.sqrt(element)){
//     if(element % start++ <1){
//       return false;
//     }
//   }

//   return true;
// }


// function getPrime(num){
//   const res=[];
//   for( let i=2;i<=num;i++){
//      if(isPrime(i)){
//         res.push(i);
//      }
//   }
//   return res;
// }

// const data=getPrime(100);

// console.log(data,333)
