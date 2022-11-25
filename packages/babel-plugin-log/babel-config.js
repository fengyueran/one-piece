const { ValueType } = require('@xinghunm/babel-plugin-log');

module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: [
    [
      '@xinghunm/babel-plugin-log',
      {
        trackerModule: './track',
        trackFuncs: [
          { funcName: 'test1', event: 'T1', valueType: ValueType.Return },
          { funcName: 'test2', event: 'T2', valueType: ValueType.Number },
          { funcName: 'handleClick', event: 'T3', valueType: ValueType.Number },
          {
            funcName: 'handleReportClick',
            event: 'T4',
            valueType: ValueType.Number,
          },
        ],
      },
    ],
  ],
};
