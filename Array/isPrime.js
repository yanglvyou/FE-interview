//如果它不是质数，那么它一定可以表示成两个数（除了1和它本身）相乘，这两个数必然有一个小于等于它的平方根。只要找到小于或等于的那个就行了
// 质数（Prime number），又称素数，指在大于1的自然数中，除了1和该数自身外，无法被其他自然数整除的数（也可定义为只有1与该数本身两个正因数的数）。
// 大于1的自然数若不是素数，则称之为合数（也称为合成数）。
// https://zh.wikipedia.org/wiki/%E8%B4%A8%E6%95%B0
function isPrime(element, index, array) {
  if (typeof element !== 'number' || !Number.isInteger(element) || element < 2) {
    return false;
  }
  let start = 2;
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
