const delay = () =>
  new Promise((reslove) => {
    setTimeout(() => {
      reslove(1);
    }, 1000);
  });

//箭头函数: ArrowFunctionExpression
const fn1 = async () => {
  const timeout = await delay();
};

//函数声明: FunctionDeclaration
async function fn2() {
  const timeout = await delay();
}

//函数表达式: FunctionExpression
const fn3 = async function () {
  const timeout = await delay();
};

//async 函数定义在对象中:
const obj = {
  async fn4() {
    const timeout = await delay();
  },
};

const fn5 = async () => {
  try {
    const timeout = await delay();
  } catch (e) {
    console.log('error', e);
  }
};
