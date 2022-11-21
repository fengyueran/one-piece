const test = async (v) => {
  const v1 = v > 1 ? 2 : 3;
  console.log('111', v1);
  const test1 = () => {
    throw new Error('99999999999999');
  };
  await test1();
};
test();
