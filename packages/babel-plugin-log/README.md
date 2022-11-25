# @xinghunm/babel-plugin-log

babel 插件，用来添加埋点:

```js
const { ValueType } = require('@xinghunm/babel-plugin-log');

module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: [
    [
      '@xinghunm/babel-plugin-log',
      {
        trackerModule: './track',
        trackFuncs: [
          { funcName: 'test1', event: 'T1', valueType: ValueType.Number },
          { funcName: 'handleClick', event: 'T2', valueType: ValueType.Number },
          {
            funcName: 'handleReoportClick',
            event: 'T3',
            valueType: ValueType.Number,
          },
        ],
      },
    ],
  ],
};
```

配置选项有两个

- trackerModule(必选)

  用来调用埋点的模块，需要**导出 default** 模块用于埋点:

  ```ts
  const track = (data: { event: string; value: any }) => {
    console.log('track', data);
  };

  export default track;
  ```

- trackFuncs(必选)

  定义要埋点的函数列表，每个列表项有以下三项配置，都是必填项:

  - funcName

    要添加埋点的函数名，要求唯一。

  - event

    事件名称。

  - valueType

    埋点值的类型， 包括:

    a) ValueType.Number
    表示埋点的值为 1。

    b) ValueType.Return
    表示埋点的值为函数返回值。
