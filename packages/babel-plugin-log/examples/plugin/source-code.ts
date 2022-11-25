const test1 = () => {
  console.log('test1');
  return 8;
};

const test2 = () => {
  console.log('test2');
  return 'str';
};

const test3 = () => {
  console.log('test3');
  return true;
};

const test4 = () => {
  console.log('test4');
  return { a: 3, v: [1, 2] };
};

const test5 = () => {
  console.log('test5');
  return () => 12;
};

const test6 = () => {
  console.log('test6');
  const b = 10;
  return 8 * 9 + 3 - b;
};

const test7 = () => {
  console.log('test7');
  const a = 8;
  return a;
};

const test8 = () => 8;

const test9 = function (v) {
  console.log('test9');
};

test9(function test10() {
  console.log('test10');
});
