// arr = [1, -2, -3, -4, -5, 6, -10];

// let s = arr.map((i, ind) => {
//   return Math.abs(i);
// });
// console.log(`Модуль для каждого: ${s}`);

// let s1 = arr
//   .filter((i, ind) => {
//     return i < 0;
//   })
//   .map((i, ind) => Math.abs(i));
// console.log(`Фильтрация только для отрицательных: ${s1}`);

// let s2 = arr
//   .filter((i, ind) => {
//     return i > 0;
//   })
//   .map((i) => i);
// console.log(`Только положительные: ${s2}`);

// let t = 0;
// let s3 = arr.forEach((el) => {
//   t += el;
// });
// console.log(t);

// let a = arr.reduce((sum, el) => sum += el, 0)
// console.log(a)

// let arr = [2, 4, 6, 8]
// let a = arr.map(i => i * 2)
// console.log(a)

// let arr = [1, 2, 3, 4, 5, 6]
// let a = arr.filter(i => i % 2 == 0).map(i => i)
// console.log(a)

// let arr = [5, 8, 12, 4, 20]
// let a = arr.find(i => i > 10)
// console.log(a)

// let a = [
//   [1, 2],
//   [3, 4],
//   [5, 6],
// ];

// let b = a.flat(2)
// console.log(b)

// let fruits = ['apple', 'banana', 'apple', 'orange', 'banana', 'apple']
// let b = fruits.reduce((n, i) => {
//     n[i] = (n[i] || 0) + 1
//     return n
// }, {})
// console.log(b)

// let arr = [
//   { name: "John", age: 15 },
//   { name: "Jane", age: 22 },
//   { name: "Bob", age: 17 },
// ];

// console.log(arr.find(i => i.age > 18).name)
// let a = arr.filter(i => i.age > 18).map(i => i.name)
// console.log(a)

// let words = ['Hello world', 'JavaScript is awesome', 'Array methods']
// let a = words.map(i => i.split(" "))
// let b = words.flatMap(i => i.split(" "))
// console.log(a.flat())
// console.log(b)

// let arr = [
//   { type: "fruit", name: "apple" },
//   { type: "vegetable", name: "carrot" },
//   { type: "fruit", name: "banana" },
// ];
// let a = arr.reduce((some, i) => {
//   if (!some[i.type]) {
//     some[i.type] = [];
//   }
//   some[i.type].push(i.name);
//   return some;
// }, {});
// console.log(a);

// let arr = [
//   { name: "Alice", grade: 85 },
//   { name: "Bob", grade: 92 },
//   { name: "Charlie", grade: 78 },
// ];

// let a = arr.map((i) => i.grade)
// let b = a.reduce((sum, i) => sum += i , 0);
// console.log(b/a.length)
