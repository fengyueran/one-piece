const test = async () => {
  const test1 = () => {
    throw new Error('99999999999999');
  };
  await test1();
};
test();
