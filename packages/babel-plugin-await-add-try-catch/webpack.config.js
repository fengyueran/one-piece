const path = require('path');

module.exports = {
  entry: './examples/compile-by-babel-or-webpack/test.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              configFile: path.resolve(__dirname, 'babel-config.json'),
            },
          },
        ],
      },
    ],
  },
};
