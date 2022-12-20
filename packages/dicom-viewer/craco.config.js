module.exports = {
  babel: {
    plugins: [
      [
        'formatjs',
        {
          idInterpolationPattern: '[sha512:contenthash:base64:6]',
          ast: true,
        },
      ],
      '@xinghunm/babel-plugin-await-add-try-catch',
    ],
  },
};
