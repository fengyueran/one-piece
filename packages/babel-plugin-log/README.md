# @xinghunm/babel-plugin-await-add-try-catch

babel 插件，用来给 await 函数加上 try catch，并添加文件名、函数名等信息。

### async 函数形式

- 箭头函数

  ```js
  const fn = async () => {
    await f();
  };
  ```

- 函数声明

  ```js
  async function fn() {
    await f();
  }
  ```

- 函数表达式

  ```js
  const fn = async function () {
    await f();
  };
  ```

- async 函数定义在对象中

  ```js
  const obj = {
    async fn() {
      await f();
    },
  };
  ```
